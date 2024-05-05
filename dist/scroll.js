import { computed, effect, signal } from '@preact/signals-core';
import { Matrix4, Vector2, Vector3 } from 'three';
import { computedBorderInset } from './utils.js';
import { clamp } from 'three/src/math/MathUtils.js';
import { createInstancedPanel } from './panel/instanced-panel.js';
import { ElementType, computedOrderInfo } from './order.js';
import { computedProperty } from './properties/batched.js';
import { createPanelMaterialConfig } from './panel/panel-material.js';
import { defaultPanelDependencies } from './panel/instanced-panel-group.js';
const distanceHelper = new Vector3();
const localPointHelper = new Vector3();
export function createScrollPosition() {
    return signal([0, 0]);
}
export function computedGlobalScrollMatrix(scrollPosition, globalMatrix, pixelSizeSignal) {
    return computed(() => {
        const global = globalMatrix.value;
        if (global == null) {
            return undefined;
        }
        const [scrollX, scrollY] = scrollPosition.value;
        const pixelSize = pixelSizeSignal.value;
        return new Matrix4().makeTranslation(-scrollX * pixelSize, scrollY * pixelSize, 0).premultiply(global);
    });
}
export function applyScrollPosition(object, scrollPosition, pixelSizeSignal, initializers) {
    return initializers.push(() => effect(() => {
        const [scrollX, scrollY] = scrollPosition.value;
        const pixelSize = pixelSizeSignal.value;
        object.current?.position.set(-scrollX * pixelSize, scrollY * pixelSize, 0);
        object.current?.updateMatrix();
    }));
}
export function computedAnyAncestorScrollable(scrollable, anyAncestorScrollable) {
    return computed(() => {
        const [ancestorX, ancestorY] = anyAncestorScrollable?.value ?? [false, false];
        const [x, y] = scrollable.value;
        return [ancestorX || x, ancestorY || y];
    });
}
export function computedScrollHandlers(scrollPosition, anyAncestorScrollable, { scrollable, maxScrollPosition }, object, listeners, pixelSize, onFrameSet, initializers) {
    const isScrollable = computed(() => scrollable.value?.some((scrollable) => scrollable) ?? false);
    const downPointerMap = new Map();
    const scrollVelocity = new Vector2();
    const scroll = (event, deltaX, deltaY, deltaTime, enableRubberBand) => {
        if (scrollPosition.value == null) {
            return;
        }
        const [wasScrolledX, wasScrolledY] = event == null ? [false, false] : getWasScrolled(event.nativeEvent);
        if (wasScrolledX) {
            deltaX = 0;
        }
        if (wasScrolledY) {
            deltaY = 0;
        }
        const [x, y] = scrollPosition.value;
        const [maxX, maxY] = maxScrollPosition.value;
        let [newX, newY] = scrollPosition.value;
        const [ancestorScrollableX, ancestorScrollableY] = anyAncestorScrollable?.value ?? [false, false];
        newX = computeScroll(x, maxX, deltaX, enableRubberBand && !ancestorScrollableX);
        newY = computeScroll(y, maxY, deltaY, enableRubberBand && !ancestorScrollableY);
        if (deltaTime != null && deltaTime > 0) {
            scrollVelocity.set(deltaX, deltaY).divideScalar(deltaTime);
        }
        if (event != null) {
            setWasScrolled(event.nativeEvent, wasScrolledX || Math.min(x, (maxX ?? 0) - x) > 5, wasScrolledY || Math.min(y, (maxY ?? 0) - y) > 5);
        }
        const preventScroll = listeners.peek()?.onScroll?.(newX, newY, scrollPosition, event);
        if (preventScroll === false || (x === newX && y === newY)) {
            return;
        }
        scrollPosition.value = [newX, newY];
    };
    const onFrame = (delta) => {
        if (downPointerMap.size > 0 || scrollPosition.value == null) {
            return;
        }
        let deltaX = 0;
        let deltaY = 0;
        const [x, y] = scrollPosition.value;
        const [maxX, maxY] = maxScrollPosition.value;
        deltaX += outsideDistance(x, 0, maxX ?? 0) * -0.3;
        deltaY += outsideDistance(y, 0, maxY ?? 0) * -0.3;
        deltaX += scrollVelocity.x * delta;
        deltaY += scrollVelocity.y * delta;
        scrollVelocity.multiplyScalar(0.9); //damping scroll factor
        if (Math.abs(scrollVelocity.x) < 0.01) {
            scrollVelocity.x = 0;
        }
        if (Math.abs(scrollVelocity.y) < 0.01) {
            scrollVelocity.y = 0;
        }
        if (deltaX === 0 && deltaY === 0) {
            return;
        }
        scroll(undefined, deltaX, deltaY, undefined, true);
    };
    initializers.push(() => effect(() => {
        if (!isScrollable.value) {
            return;
        }
        onFrameSet.add(onFrame);
        return () => onFrameSet.delete(onFrame);
    }));
    return computed(() => {
        if (!isScrollable.value) {
            return undefined;
        }
        return {
            onPointerDown: ({ nativeEvent, point }) => {
                let interaction = downPointerMap.get(nativeEvent.pointerId);
                if (interaction == null) {
                    downPointerMap.set(nativeEvent.pointerId, (interaction = { timestamp: 0, point: new Vector3() }));
                }
                interaction.timestamp = performance.now() / 1000;
                object.current.worldToLocal(interaction.point.copy(point));
            },
            onPointerUp: ({ nativeEvent }) => downPointerMap.delete(nativeEvent.pointerId),
            onPointerLeave: ({ nativeEvent }) => downPointerMap.delete(nativeEvent.pointerId),
            onPointerCancel: ({ nativeEvent }) => downPointerMap.delete(nativeEvent.pointerId),
            onPointerMove: (event) => {
                const prevInteraction = downPointerMap.get(event.nativeEvent.pointerId);
                if (prevInteraction == null) {
                    return;
                }
                object.current.worldToLocal(localPointHelper.copy(event.point));
                distanceHelper.copy(localPointHelper).sub(prevInteraction.point).divideScalar(pixelSize.peek());
                const timestamp = performance.now() / 1000;
                const deltaTime = timestamp - prevInteraction.timestamp;
                prevInteraction.point.copy(localPointHelper);
                prevInteraction.timestamp = timestamp;
                if (event.defaultPrevented) {
                    return;
                }
                scroll(event, -distanceHelper.x, distanceHelper.y, deltaTime, true);
            },
            onWheel: (event) => {
                if (event.defaultPrevented) {
                    return;
                }
                const { nativeEvent } = event;
                scroll(event, nativeEvent.deltaX, nativeEvent.deltaY, undefined, false);
            },
        };
    });
}
const wasScrolledSymbol = Symbol('was-scrolled');
function getWasScrolled(event) {
    return event[wasScrolledSymbol] ?? [false, false];
}
function setWasScrolled(event, x, y) {
    event[wasScrolledSymbol] = [x, y];
}
function computeScroll(position, maxPosition, delta, enableRubberBand) {
    if (delta === 0) {
        return position;
    }
    const outside = outsideDistance(position, 0, maxPosition ?? 0);
    if (sign(delta) === sign(outside)) {
        delta *= Math.max(0, 1 - Math.abs(outside) / 100);
    }
    let newPosition = position + delta;
    if (enableRubberBand && maxPosition != null) {
        return newPosition;
    }
    return clamp(newPosition, 0, maxPosition ?? 0);
}
function sign(value) {
    return value >= 0;
}
function outsideDistance(value, min, max) {
    if (value < min) {
        return value - min;
    }
    if (value > max) {
        return value - max;
    }
    return 0;
}
const scrollbarBorderPropertyKeys = [
    'scrollbarBorderLeftWidth',
    'scrollbarBorderRightWidth',
    'scrollbarBorderTopWidth',
    'scrollbarBorderBottomWidth',
];
export function createScrollbars(propertiesSignal, scrollPosition, flexState, globalMatrix, isVisible, parentClippingRect, orderInfo, panelGroupManager, initializers) {
    const scrollbarOrderInfo = computedOrderInfo(undefined, ElementType.Panel, defaultPanelDependencies, orderInfo);
    const scrollbarWidth = computedProperty(propertiesSignal, 'scrollbarWidth', 10);
    const borderInset = computedBorderInset(propertiesSignal, scrollbarBorderPropertyKeys);
    createScrollbar(propertiesSignal, 0, scrollPosition, flexState, globalMatrix, isVisible, parentClippingRect, scrollbarOrderInfo, panelGroupManager, scrollbarWidth, borderInset, initializers);
    createScrollbar(propertiesSignal, 1, scrollPosition, flexState, globalMatrix, isVisible, parentClippingRect, scrollbarOrderInfo, panelGroupManager, scrollbarWidth, borderInset, initializers);
}
let scrollbarMaterialConfig;
function getScrollbarMaterialConfig() {
    scrollbarMaterialConfig ??= createPanelMaterialConfig({
        backgroundColor: 'scrollbarColor',
        borderBottomLeftRadius: 'scrollbarBorderBottomLeftRadius',
        borderBottomRightRadius: 'scrollbarBorderBottomRightRadius',
        borderTopRightRadius: 'scrollbarBorderTopRightRadius',
        borderTopLeftRadius: 'scrollbarBorderTopLeftRadius',
        borderColor: 'scrollbarBorderColor',
        borderBend: 'scrollbarBorderBend',
        borderOpacity: 'scrollbarBorderOpacity',
        backgroundOpacity: 'scrollbarOpacity',
    }, {
        backgroundColor: 0xffffff,
        backgroundOpacity: 1,
    });
    return scrollbarMaterialConfig;
}
function createScrollbar(propertiesSignal, mainIndex, scrollPosition, flexState, globalMatrix, isVisible, parentClippingRect, orderInfo, panelGroupManager, scrollbarWidth, borderSize, initializers) {
    const scrollbarTransformation = computed(() => computeScrollbarTransformation(mainIndex, scrollbarWidth.value, flexState.size.value, flexState.maxScrollPosition.value, flexState.borderInset.value, scrollPosition.value));
    const scrollbarPosition = computed(() => (scrollbarTransformation.value?.slice(0, 2) ?? [0, 0]));
    const scrollbarSize = computed(() => (scrollbarTransformation.value?.slice(2, 4) ?? [0, 0]));
    initializers.push((subscriptions) => createInstancedPanel(propertiesSignal, orderInfo, undefined, panelGroupManager, globalMatrix, scrollbarSize, scrollbarPosition, borderSize, parentClippingRect, isVisible, getScrollbarMaterialConfig(), subscriptions));
}
function computeScrollbarTransformation(mainIndex, otherScrollbarSize, size, maxScrollbarPosition, borderInset, scrollPosition) {
    if (size == null || borderInset == null || scrollPosition == null) {
        return undefined;
    }
    const maxMainScrollbarPosition = maxScrollbarPosition[mainIndex];
    if (maxMainScrollbarPosition == null) {
        return undefined;
    }
    const result = [0, 0, 0, 0];
    const invertedIndex = 1 - mainIndex;
    const mainSizeWithoutBorder = size[mainIndex] - borderInset[invertedIndex] - borderInset[invertedIndex + 2];
    const mainScrollbarSize = Math.max(otherScrollbarSize, (mainSizeWithoutBorder * mainSizeWithoutBorder) / (maxMainScrollbarPosition + mainSizeWithoutBorder));
    const maxScrollbarDistancance = mainSizeWithoutBorder - mainScrollbarSize;
    const mainScrollPosition = scrollPosition[mainIndex];
    //position
    result[mainIndex] =
        size[mainIndex] * 0.5 -
            mainScrollbarSize * 0.5 -
            borderInset[(mainIndex + 3) % 4] -
            maxScrollbarDistancance * clamp(mainScrollPosition / maxMainScrollbarPosition, 0, 1);
    result[invertedIndex] = size[invertedIndex] * 0.5 - otherScrollbarSize * 0.5 - borderInset[invertedIndex + 1];
    if (mainIndex === 0) {
        result[0] *= -1;
        result[1] *= -1;
    }
    //size
    result[mainIndex + 2] = mainScrollbarSize;
    result[invertedIndex + 2] = otherScrollbarSize;
    return result;
}
