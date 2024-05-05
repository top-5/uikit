import { createFlexNodeState } from '../flex/node.js';
import { createHoverPropertyTransformers, setupCursorCleanup } from '../hover.js';
import { computedIsClipped, computedClippingRect } from '../clipping.js';
import { applyScrollPosition, computedAnyAncestorScrollable, computedGlobalScrollMatrix, computedScrollHandlers, createScrollPosition, createScrollbars, } from '../scroll.js';
import { createInstancedPanel } from '../panel/instanced-panel.js';
import { applyTransform, computedTransformMatrix } from '../transform.js';
import { createResponsivePropertyTransformers } from '../responsive.js';
import { ElementType, computedOrderInfo } from '../order.js';
import { createActivePropertyTransfomers } from '../active.js';
import { signal } from '@preact/signals-core';
import { computedGlobalMatrix, computedHandlers, computedIsVisible, computedMergedProperties, createNode, } from './utils.js';
import { setupLayoutListeners, setupViewportListeners } from '../listeners.js';
import { computedPanelGroupDependencies } from '../panel/instanced-panel-group.js';
import { createInteractionPanel } from '../panel/instanced-panel-mesh.js';
import { darkPropertyTransformers } from '../dark.js';
import { getDefaultPanelMaterialConfig } from '../panel/index.js';
export function createContainer(parentContext, style, properties, defaultProperties, object, childrenContainer) {
    const node = signal(undefined);
    const flexState = createFlexNodeState();
    const hoveredSignal = signal([]);
    const activeSignal = signal([]);
    const initializers = [];
    setupCursorCleanup(hoveredSignal, initializers);
    //properties
    const mergedProperties = computedMergedProperties(style, properties, defaultProperties, {
        ...darkPropertyTransformers,
        ...createResponsivePropertyTransformers(parentContext.root.size),
        ...createHoverPropertyTransformers(hoveredSignal),
        ...createActivePropertyTransfomers(activeSignal),
    });
    //create node
    createNode(node, flexState, parentContext, mergedProperties, object, initializers);
    //transform
    const transformMatrix = computedTransformMatrix(mergedProperties, flexState, parentContext.root.pixelSize);
    applyTransform(object, transformMatrix, initializers);
    const globalMatrix = computedGlobalMatrix(parentContext.childrenMatrix, transformMatrix);
    const isClipped = computedIsClipped(parentContext.clippingRect, globalMatrix, flexState.size, parentContext.root.pixelSize);
    const isVisible = computedIsVisible(flexState, isClipped, mergedProperties);
    //instanced panel
    const groupDeps = computedPanelGroupDependencies(mergedProperties);
    const orderInfo = computedOrderInfo(mergedProperties, ElementType.Panel, groupDeps, parentContext.orderInfo);
    initializers.push((subscriptions) => createInstancedPanel(mergedProperties, orderInfo, groupDeps, parentContext.root.panelGroupManager, globalMatrix, flexState.size, undefined, flexState.borderInset, parentContext.clippingRect, isVisible, getDefaultPanelMaterialConfig(), subscriptions));
    //scrolling:
    const scrollPosition = createScrollPosition();
    applyScrollPosition(childrenContainer, scrollPosition, parentContext.root.pixelSize, initializers);
    const childrenMatrix = computedGlobalScrollMatrix(scrollPosition, globalMatrix, parentContext.root.pixelSize);
    createScrollbars(mergedProperties, scrollPosition, flexState, globalMatrix, isVisible, parentContext.clippingRect, orderInfo, parentContext.root.panelGroupManager, initializers);
    const scrollHandlers = computedScrollHandlers(scrollPosition, parentContext.anyAncestorScrollable, flexState, object, properties, parentContext.root.pixelSize, parentContext.root.onFrameSet, initializers);
    setupLayoutListeners(style, properties, flexState.size, initializers);
    setupViewportListeners(style, properties, isVisible, initializers);
    return Object.assign(flexState, {
        anyAncestorScrollable: computedAnyAncestorScrollable(flexState.scrollable, parentContext.anyAncestorScrollable),
        clippingRect: computedClippingRect(globalMatrix, flexState, parentContext.root.pixelSize, parentContext.clippingRect),
        childrenMatrix,
        node,
        orderInfo,
        root: parentContext.root,
        scrollPosition,
        interactionPanel: createInteractionPanel(orderInfo, parentContext.root, parentContext.clippingRect, flexState.size, initializers),
        handlers: computedHandlers(style, properties, defaultProperties, hoveredSignal, activeSignal, scrollHandlers),
        initializers,
    });
}
