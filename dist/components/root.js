import { computed, signal } from '@preact/signals-core';
import { FlexNode, createFlexNodeState } from '../flex/index.js';
import { setupLayoutListeners } from '../listeners.js';
import { createInstancedPanel } from '../panel/instanced-panel.js';
import { PanelGroupManager, computedPanelGroupDependencies, } from '../panel/instanced-panel-group.js';
import { applyScrollPosition, computedGlobalScrollMatrix, createScrollPosition, createScrollbars, computedScrollHandlers, } from '../scroll.js';
import { applyTransform, computedTransformMatrix } from '../transform.js';
import { alignmentXMap, alignmentYMap, readReactive } from '../utils.js';
import { computedHandlers, computedIsVisible, computedMergedProperties, } from './utils.js';
import { computedClippingRect } from '../clipping.js';
import { computedOrderInfo, ElementType } from '../order.js';
import { Matrix4, Plane, Vector3 } from 'three';
import { GlyphGroupManager } from '../text/render/instanced-glyph-group.js';
import { createActivePropertyTransfomers } from '../active.js';
import { createHoverPropertyTransformers, setupCursorCleanup } from '../hover.js';
import { createInteractionPanel } from '../panel/instanced-panel-mesh.js';
import { createResponsivePropertyTransformers } from '../responsive.js';
import { darkPropertyTransformers } from '../dark.js';
import { computedProperty } from '../properties/index.js';
import { getDefaultPanelMaterialConfig } from '../panel/index.js';
export const DEFAULT_PIXEL_SIZE = 0.01;
const vectorHelper = new Vector3();
const planeHelper = new Plane();
const identityMatrix = signal(new Matrix4());
export function createRoot(pixelSize, style, properties, defaultProperties, object, childrenContainer, getCamera, renderer, onFrameSet) {
    const rootSize = signal([0, 0]);
    const hoveredSignal = signal([]);
    const activeSignal = signal([]);
    const initializers = [];
    setupCursorCleanup(hoveredSignal, initializers);
    const mergedProperties = computedMergedProperties(style, properties, defaultProperties, {
        ...darkPropertyTransformers,
        ...createResponsivePropertyTransformers(rootSize),
        ...createHoverPropertyTransformers(hoveredSignal),
        ...createActivePropertyTransfomers(activeSignal),
    }, {
        ...createSizeTranslator(pixelSize, 'sizeX', 'width'),
        ...createSizeTranslator(pixelSize, 'sizeY', 'height'),
    });
    const renderOrder = computedProperty(mergedProperties, 'renderOrder', 0);
    const depthTest = computedProperty(mergedProperties, 'depthTest', true);
    const node = signal(undefined);
    const requestCalculateLayout = createDeferredRequestLayoutCalculation(onFrameSet, node, initializers);
    const flexState = createFlexNodeState();
    initializers.push((subscriptions) => {
        const newNode = new FlexNode(flexState, mergedProperties, requestCalculateLayout, object, subscriptions);
        node.value = newNode;
        return subscriptions;
    });
    const transformMatrix = computedTransformMatrix(mergedProperties, flexState, pixelSize);
    const rootMatrix = computedRootMatrix(mergedProperties, transformMatrix, flexState.size, pixelSize);
    //rootMatrix is automatically applied to everything, even the instanced things because everything is part of object
    applyTransform(object, rootMatrix, initializers);
    const groupDeps = computedPanelGroupDependencies(mergedProperties);
    const orderInfo = computedOrderInfo(undefined, ElementType.Panel, groupDeps, undefined);
    const ctx = { cameraDistance: 0, onFrameSet };
    const panelGroupManager = new PanelGroupManager(renderOrder, depthTest, pixelSize, ctx, object, initializers);
    const onCameraDistanceFrame = () => {
        if (object.current == null) {
            ctx.cameraDistance = 0;
            return;
        }
        planeHelper.normal.set(0, 0, 1);
        planeHelper.constant = 0;
        planeHelper.applyMatrix4(object.current.matrixWorld);
        vectorHelper.setFromMatrixPosition(getCamera().matrixWorld);
        ctx.cameraDistance = planeHelper.distanceToPoint(vectorHelper);
    };
    initializers.push(() => {
        onFrameSet.add(onCameraDistanceFrame);
        return () => onFrameSet.delete(onCameraDistanceFrame);
    });
    const isVisible = computedIsVisible(flexState, undefined, mergedProperties);
    initializers.push((subscriptions) => createInstancedPanel(mergedProperties, orderInfo, groupDeps, panelGroupManager, identityMatrix, flexState.size, undefined, flexState.borderInset, undefined, isVisible, getDefaultPanelMaterialConfig(), subscriptions));
    const scrollPosition = createScrollPosition();
    applyScrollPosition(childrenContainer, scrollPosition, pixelSize, initializers);
    const childrenMatrix = computedGlobalScrollMatrix(scrollPosition, identityMatrix, pixelSize);
    createScrollbars(mergedProperties, scrollPosition, flexState, identityMatrix, isVisible, undefined, orderInfo, panelGroupManager, initializers);
    const scrollHandlers = computedScrollHandlers(scrollPosition, undefined, flexState, object, properties, pixelSize, onFrameSet, initializers);
    setupLayoutListeners(style, properties, flexState.size, initializers);
    const gylphGroupManager = new GlyphGroupManager(renderOrder, depthTest, pixelSize, ctx, object, initializers);
    const rootCtx = Object.assign(ctx, {
        requestCalculateLayout,
        cameraDistance: 0,
        gylphGroupManager,
        object,
        panelGroupManager,
        pixelSize,
        renderOrder,
        depthTest,
        renderer,
        size: flexState.size,
    });
    return Object.assign(flexState, {
        anyAncestorScrollable: flexState.scrollable,
        clippingRect: computedClippingRect(identityMatrix, flexState, pixelSize, undefined),
        childrenMatrix,
        node,
        orderInfo,
        initializers,
        interactionPanel: createInteractionPanel(orderInfo, rootCtx, undefined, flexState.size, initializers),
        handlers: computedHandlers(style, properties, defaultProperties, hoveredSignal, activeSignal, scrollHandlers),
        root: rootCtx,
    });
}
function createDeferredRequestLayoutCalculation(onFrameSet, nodeSignal, initializers) {
    let requested = false;
    const onFrame = () => {
        const node = nodeSignal.peek();
        if (!requested || node == null) {
            return;
        }
        requested = false;
        node.calculateLayout();
    };
    initializers.push(() => {
        onFrameSet.add(onFrame);
        return () => onFrameSet.delete(onFrame);
    });
    return () => (requested = true);
}
function createSizeTranslator(pixelSize, key, to) {
    const map = new Map();
    return {
        [key]: (value, target) => {
            let entry = map.get(value);
            if (entry == null) {
                map.set(value, (entry = computed(() => {
                    const s = readReactive(value);
                    if (s == null) {
                        return undefined;
                    }
                    return s / pixelSize.value;
                })));
            }
            target.add(to, entry);
        },
    };
}
const matrixHelper = new Matrix4();
const defaultAnchorX = 'center';
const defaultAnchorY = 'center';
function computedRootMatrix(propertiesSignal, matrix, size, pixelSize) {
    const anchorX = computedProperty(propertiesSignal, 'anchorX', defaultAnchorX);
    const anchorY = computedProperty(propertiesSignal, 'anchorY', defaultAnchorY);
    return computed(() => {
        if (size.value == null) {
            return undefined;
        }
        const [width, height] = size.value;
        return matrix.value
            ?.clone()
            .premultiply(matrixHelper.makeTranslation(alignmentXMap[anchorX.value] * width * pixelSize.value, alignmentYMap[anchorY.value] * height * pixelSize.value, 0));
    });
}
