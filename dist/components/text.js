import { createFlexNodeState } from '../flex/node.js';
import { createHoverPropertyTransformers, setupCursorCleanup } from '../hover.js';
import { computedIsClipped } from '../clipping.js';
import { createInstancedPanel } from '../panel/instanced-panel.js';
import { applyTransform, computedTransformMatrix } from '../transform.js';
import { createResponsivePropertyTransformers } from '../responsive.js';
import { ElementType, computedOrderInfo } from '../order.js';
import { createActivePropertyTransfomers } from '../active.js';
import { effect, signal } from '@preact/signals-core';
import { computedGlobalMatrix, computedHandlers, computedIsVisible, computedMergedProperties, createNode, } from './utils.js';
import { setupLayoutListeners, setupViewportListeners } from '../listeners.js';
import { computedPanelGroupDependencies } from '../panel/instanced-panel-group.js';
import { createInteractionPanel, getDefaultPanelMaterialConfig } from '../panel/index.js';
import { computedFont, computedGylphGroupDependencies, createInstancedText, } from '../text/index.js';
import { darkPropertyTransformers } from '../dark.js';
export function createText(parentContext, textSignal, fontFamilies, style, properties, defaultProperties, object) {
    const hoveredSignal = signal([]);
    const activeSignal = signal([]);
    const initializers = [];
    setupCursorCleanup(hoveredSignal, initializers);
    const mergedProperties = computedMergedProperties(style, properties, defaultProperties, {
        ...darkPropertyTransformers,
        ...createResponsivePropertyTransformers(parentContext.root.size),
        ...createHoverPropertyTransformers(hoveredSignal),
        ...createActivePropertyTransfomers(activeSignal),
    });
    const nodeSignal = signal(undefined);
    const flexState = createFlexNodeState();
    createNode(nodeSignal, flexState, parentContext, mergedProperties, object, initializers);
    const transformMatrix = computedTransformMatrix(mergedProperties, flexState, parentContext.root.pixelSize);
    applyTransform(object, transformMatrix, initializers);
    const globalMatrix = computedGlobalMatrix(parentContext.childrenMatrix, transformMatrix);
    const isClipped = computedIsClipped(parentContext.clippingRect, globalMatrix, flexState.size, parentContext.root.pixelSize);
    const isVisible = computedIsVisible(flexState, isClipped, mergedProperties);
    const groupDeps = computedPanelGroupDependencies(mergedProperties);
    const backgroundOrderInfo = computedOrderInfo(mergedProperties, ElementType.Panel, groupDeps, parentContext.orderInfo);
    initializers.push((subscriptions) => createInstancedPanel(mergedProperties, backgroundOrderInfo, groupDeps, parentContext.root.panelGroupManager, globalMatrix, flexState.size, undefined, flexState.borderInset, parentContext.clippingRect, isVisible, getDefaultPanelMaterialConfig(), subscriptions));
    const fontSignal = computedFont(mergedProperties, fontFamilies, parentContext.root.renderer, initializers);
    const orderInfo = computedOrderInfo(undefined, ElementType.Text, computedGylphGroupDependencies(fontSignal), backgroundOrderInfo);
    const measureFunc = createInstancedText(mergedProperties, textSignal, globalMatrix, nodeSignal, flexState, isVisible, parentContext.clippingRect, orderInfo, fontSignal, parentContext.root.gylphGroupManager, undefined, undefined, undefined, undefined, initializers, 'break-word');
    initializers.push(() => effect(() => nodeSignal.value?.setMeasureFunc(measureFunc)));
    setupLayoutListeners(style, properties, flexState.size, initializers);
    setupViewportListeners(style, properties, isVisible, initializers);
    return Object.assign(flexState, {
        interactionPanel: createInteractionPanel(backgroundOrderInfo, parentContext.root, parentContext.clippingRect, flexState.size, initializers),
        handlers: computedHandlers(style, properties, defaultProperties, hoveredSignal, activeSignal),
        initializers,
    });
}
