import { createFlexNodeState } from '../flex/index.js';
import { createHoverPropertyTransformers, setupCursorCleanup } from '../hover.js';
import { computedIsClipped } from '../clipping.js';
import { createInstancedPanel } from '../panel/instanced-panel.js';
import { applyTransform, computedTransformMatrix } from '../transform.js';
import { computedProperty, traverseProperties, } from '../properties/index.js';
import { createResponsivePropertyTransformers } from '../responsive.js';
import { ElementType, computedOrderInfo } from '../order.js';
import { createActivePropertyTransfomers } from '../active.js';
import { computed, effect, signal } from '@preact/signals-core';
import { computedGlobalMatrix, computedHandlers, computedIsVisible, computedMergedProperties, createNode, } from './utils.js';
import { readReactive } from '../utils.js';
import { setupLayoutListeners, setupViewportListeners } from '../listeners.js';
import { computedPanelGroupDependencies } from '../panel/instanced-panel-group.js';
import { createInteractionPanel } from '../panel/instanced-panel-mesh.js';
import { createCaret } from '../caret.js';
import { createSelection } from '../selection.js';
import { createFocusPropertyTransformers } from '../focus.js';
import { computedFont, computedGylphGroupDependencies, createInstancedText, } from '../text/index.js';
import { darkPropertyTransformers } from '../dark.js';
import { getDefaultPanelMaterialConfig } from '../panel/index.js';
const cancelSet = new Set();
function cancelBlur(event) {
    cancelSet.add(event);
}
export const canvasInputProps = {
    onPointerDown: (e) => {
        if (!(document.activeElement instanceof HTMLElement)) {
            return;
        }
        if (!cancelSet.has(e.nativeEvent)) {
            return;
        }
        cancelSet.delete(e.nativeEvent);
        e.preventDefault();
    },
};
export function createInput(parentContext, fontFamilies, style, properties, defaultProperties, object) {
    const hoveredSignal = signal([]);
    const activeSignal = signal([]);
    const hasFocusSignal = signal(false);
    const initializers = [];
    setupCursorCleanup(hoveredSignal, initializers);
    const mergedProperties = computedMergedProperties(style, properties, defaultProperties, {
        ...darkPropertyTransformers,
        ...createResponsivePropertyTransformers(parentContext.root.size),
        ...createHoverPropertyTransformers(hoveredSignal),
        ...createActivePropertyTransfomers(activeSignal),
        ...createFocusPropertyTransformers(hasFocusSignal),
    }, undefined, (m) => {
        traverseProperties(style.value, properties.value, defaultProperties.value, (p) => {
            m.add('caretOpacity', p.opacity);
            m.add('caretColor', p.color);
        });
    });
    const flexState = createFlexNodeState();
    const nodeSignal = signal(undefined);
    createNode(nodeSignal, flexState, parentContext, mergedProperties, object, initializers);
    const transformMatrix = computedTransformMatrix(mergedProperties, flexState, parentContext.root.pixelSize);
    applyTransform(object, transformMatrix, initializers);
    const globalMatrix = computedGlobalMatrix(parentContext.childrenMatrix, transformMatrix);
    const isClipped = computedIsClipped(parentContext.clippingRect, globalMatrix, flexState.size, parentContext.root.pixelSize);
    const isVisible = computedIsVisible(flexState, isClipped, mergedProperties);
    const groupDeps = computedPanelGroupDependencies(mergedProperties);
    const backgroundOrderInfo = computedOrderInfo(mergedProperties, ElementType.Panel, groupDeps, parentContext.orderInfo);
    initializers.push((subscriptions) => createInstancedPanel(mergedProperties, backgroundOrderInfo, groupDeps, parentContext.root.panelGroupManager, globalMatrix, flexState.size, undefined, flexState.borderInset, parentContext.clippingRect, isVisible, getDefaultPanelMaterialConfig(), subscriptions));
    const instancedTextRef = {};
    const selectionBoxes = signal([]);
    const caretPosition = signal(undefined);
    const selectionRange = signal(undefined);
    createCaret(mergedProperties, globalMatrix, caretPosition, isVisible, backgroundOrderInfo, parentContext.clippingRect, parentContext.root.panelGroupManager, initializers);
    const selectionOrderInfo = createSelection(mergedProperties, globalMatrix, selectionBoxes, isVisible, backgroundOrderInfo, parentContext.clippingRect, parentContext.root.panelGroupManager, initializers);
    const fontSignal = computedFont(mergedProperties, fontFamilies, parentContext.root.renderer, initializers);
    const orderInfo = computedOrderInfo(undefined, ElementType.Text, computedGylphGroupDependencies(fontSignal), selectionOrderInfo);
    const defaultValue = style.peek()?.defaultValue ?? properties.peek()?.defaultValue;
    const writeValue = style.value?.value == null && properties.value?.value == null ? signal(defaultValue ?? '') : undefined;
    const valueSignal = computed(() => writeValue?.value ?? readReactive(style.value?.value) ?? readReactive(properties.value?.value) ?? '');
    const multiline = style.peek()?.multiline ?? properties.peek()?.multiline ?? false;
    const measureFunc = createInstancedText(mergedProperties, valueSignal, globalMatrix, nodeSignal, flexState, isVisible, parentContext.clippingRect, orderInfo, fontSignal, parentContext.root.gylphGroupManager, selectionRange, selectionBoxes, caretPosition, instancedTextRef, initializers, multiline ? 'break-word' : 'keep-all');
    initializers.push(() => effect(() => nodeSignal.value?.setMeasureFunc(measureFunc)));
    setupLayoutListeners(style, properties, flexState.size, initializers);
    setupViewportListeners(style, properties, isVisible, initializers);
    const disabled = computedProperty(mergedProperties, 'disabled', false);
    const element = createHtmlInputElement(valueSignal, selectionRange, (newValue) => {
        if (writeValue != null) {
            writeValue.value = newValue;
        }
        style.peek()?.onValueChange?.(newValue);
        properties.peek()?.onValueChange?.(newValue);
    }, multiline, disabled, computedProperty(mergedProperties, 'tabIndex', 0), initializers);
    const focus = (start, end, direction) => {
        const inputElement = element.peek();
        if (inputElement == null) {
            return;
        }
        if (!hasFocusSignal.peek()) {
            inputElement.focus();
        }
        if (start != null && end != null) {
            inputElement.setSelectionRange(start, end, direction);
        }
        selectionRange.value = [inputElement.selectionStart ?? 0, inputElement.selectionEnd ?? 0];
    };
    updateHasFocus(element, hasFocusSignal, initializers);
    const selectionHandlers = computedSelectionHandlers(flexState, instancedTextRef, focus, disabled);
    return Object.assign(flexState, {
        valueSignal,
        focus: () => focus(),
        root: parentContext.root,
        element,
        node: nodeSignal,
        interactionPanel: createInteractionPanel(backgroundOrderInfo, parentContext.root, parentContext.clippingRect, flexState.size, initializers),
        handlers: computedHandlers(style, properties, defaultProperties, hoveredSignal, activeSignal, selectionHandlers, 'text'),
        initializers,
    });
}
export function computedSelectionHandlers(flexState, instancedTextRef, focus, disabled) {
    return computed(() => {
        if (disabled.value) {
            return undefined;
        }
        let startCharIndex;
        return {
            onPointerDown: (e) => {
                if (e.defaultPrevented || e.uv == null || instancedTextRef.current == null) {
                    return;
                }
                cancelBlur(e.nativeEvent);
                e.stopPropagation?.();
                const charIndex = uvToCharIndex(flexState, e.uv, instancedTextRef.current);
                startCharIndex = charIndex;
                setTimeout(() => focus(charIndex, charIndex));
            },
            onPointerUp: (e) => {
                startCharIndex = undefined;
            },
            onPointerLeave: (e) => {
                startCharIndex = undefined;
            },
            onPointerMove: (e) => {
                if (startCharIndex == null || e.uv == null || instancedTextRef.current == null) {
                    return;
                }
                e.stopPropagation?.();
                const charIndex = uvToCharIndex(flexState, e.uv, instancedTextRef.current);
                const start = Math.min(startCharIndex, charIndex);
                const end = Math.max(startCharIndex, charIndex);
                const direction = startCharIndex < charIndex ? 'forward' : 'backward';
                setTimeout(() => focus(start, end, direction));
            },
        };
    });
}
export function createHtmlInputElement(value, selectionRange, onChange, multiline, disabled, tabIndex, initializers) {
    const elementSignal = signal(undefined);
    initializers.push((subscriptions) => {
        const element = document.createElement(multiline ? 'textarea' : 'input');
        const style = element.style;
        style.setProperty('position', 'absolute');
        style.setProperty('left', '-1000vw');
        style.setProperty('pointerEvents', 'none');
        style.setProperty('opacity', '0');
        element.addEventListener('input', () => {
            onChange?.(element.value);
            updateSelection();
        });
        const updateSelection = () => {
            const { selectionStart, selectionEnd } = element;
            if (selectionStart == null || selectionEnd == null) {
                selectionRange.value = undefined;
                return;
            }
            const current = selectionRange.peek();
            if (current != null && current[0] === selectionStart && current[1] === selectionEnd) {
                return;
            }
            selectionRange.value = [selectionStart, selectionEnd];
        };
        element.addEventListener('keydown', updateSelection);
        element.addEventListener('keyup', updateSelection);
        element.addEventListener('blur', () => (selectionRange.value = undefined));
        document.body.appendChild(element);
        elementSignal.value = element;
        subscriptions.push(() => {
            elementSignal.value = undefined;
            element.remove();
        }, effect(() => (element.value = value.value)), effect(() => (element.disabled = disabled.value)), effect(() => (element.tabIndex = tabIndex.value)));
        return subscriptions;
    });
    return elementSignal;
}
function updateHasFocus(elementSignal, hasFocusSignal, initializers) {
    initializers.push(() => effect(() => {
        const element = elementSignal.value;
        if (element == null) {
            return;
        }
        const updateFocus = () => (hasFocusSignal.value = document.activeElement === element);
        updateFocus();
        element.addEventListener('focus', updateFocus);
        element.addEventListener('blur', updateFocus);
        return () => {
            element.removeEventListener('focus', updateFocus);
            element.removeEventListener('blur', updateFocus);
        };
    }));
}
function uvToCharIndex({ size: s, borderInset: b, paddingInset: p }, uv, instancedText) {
    const size = s.peek();
    const borderInset = b.peek();
    const paddingInset = p.peek();
    if (size == null || borderInset == null || paddingInset == null) {
        return 0;
    }
    const [width, height] = size;
    const [bTop, , , bLeft] = borderInset;
    const [pTop, , , pLeft] = paddingInset;
    const x = uv.x * width - bLeft - pLeft;
    const y = -uv.y * height + bTop + pTop;
    return instancedText.getCharIndex(x, y);
}
