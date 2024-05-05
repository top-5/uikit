import { createFlexNodeState } from '../flex/node.js';
import { createHoverPropertyTransformers, setupCursorCleanup } from '../hover.js';
import { computedIsClipped, createGlobalClippingPlanes } from '../clipping.js';
import { createInstancedPanel } from '../panel/instanced-panel.js';
import { applyTransform, computedTransformMatrix } from '../transform.js';
import { createResponsivePropertyTransformers } from '../responsive.js';
import { ElementType, computedOrderInfo, setupRenderOrder } from '../order.js';
import { createActivePropertyTransfomers } from '../active.js';
import { computed, effect, signal } from '@preact/signals-core';
import { computedGlobalMatrix, computedHandlers, computedIsVisible, computedMergedProperties, createNode, keepAspectRatioPropertyTransformer, } from './utils.js';
import { alignmentZMap } from '../utils.js';
import { setupLayoutListeners, setupViewportListeners } from '../listeners.js';
import { computedPanelGroupDependencies } from '../panel/instanced-panel-group.js';
import { createInteractionPanel } from '../panel/instanced-panel-mesh.js';
import { Box3, Material, Mesh, Vector3 } from 'three';
import { darkPropertyTransformers } from '../dark.js';
import { getDefaultPanelMaterialConfig, makeClippedRaycast } from '../panel/index.js';
import { computedProperty } from '../properties/index.js';
export function createContent(parentContext, style, properties, defaultProperties, object, contentContainerRef) {
    const hoveredSignal = signal([]);
    const activeSignal = signal([]);
    const initializers = [];
    const flexState = createFlexNodeState();
    setupCursorCleanup(hoveredSignal, initializers);
    const sizeSignal = signal(new Vector3(1, 1, 1));
    const aspectRatio = computed(() => sizeSignal.value.x / sizeSignal.value.y);
    //properties
    const mergedProperties = computedMergedProperties(style, properties, defaultProperties, {
        ...darkPropertyTransformers,
        ...createResponsivePropertyTransformers(parentContext.root.size),
        ...createHoverPropertyTransformers(hoveredSignal),
        ...createActivePropertyTransfomers(activeSignal),
    }, keepAspectRatioPropertyTransformer, (m) => m.add('aspectRatio', aspectRatio));
    //create node
    createNode(undefined, flexState, parentContext, mergedProperties, object, initializers);
    //transform
    const transformMatrix = computedTransformMatrix(mergedProperties, flexState, parentContext.root.pixelSize);
    applyTransform(object, transformMatrix, initializers);
    const globalMatrix = computedGlobalMatrix(parentContext.childrenMatrix, transformMatrix);
    const isClipped = computedIsClipped(parentContext.clippingRect, globalMatrix, flexState.size, parentContext.root.pixelSize);
    const isVisible = computedIsVisible(flexState, isClipped, mergedProperties);
    //instanced panel
    const groupDeps = computedPanelGroupDependencies(mergedProperties);
    const backgroundorderInfo = computedOrderInfo(mergedProperties, ElementType.Panel, groupDeps, parentContext.orderInfo);
    initializers.push((subscriptions) => createInstancedPanel(mergedProperties, backgroundorderInfo, groupDeps, parentContext.root.panelGroupManager, globalMatrix, flexState.size, undefined, flexState.borderInset, parentContext.clippingRect, isVisible, getDefaultPanelMaterialConfig(), subscriptions));
    const orderInfo = computedOrderInfo(undefined, ElementType.Object, undefined, backgroundorderInfo);
    setupLayoutListeners(style, properties, flexState.size, initializers);
    setupViewportListeners(style, properties, isVisible, initializers);
    return Object.assign(flexState, {
        remeasureContent: createMeasureContent(mergedProperties, parentContext.root, flexState, parentContext.clippingRect, orderInfo, sizeSignal, contentContainerRef, initializers),
        interactionPanel: createInteractionPanel(backgroundorderInfo, parentContext.root, parentContext.clippingRect, flexState.size, initializers),
        handlers: computedHandlers(style, properties, defaultProperties, hoveredSignal, activeSignal),
        initializers,
    });
}
const box3Helper = new Box3();
const smallValue = new Vector3().setScalar(0.001);
const vectorHelper = new Vector3();
const defaultDepthAlign = 'back';
/**
 * normalizes the content so it has a height of 1
 */
function createMeasureContent(propertiesSignal, root, flexState, parentClippingRect, orderInfo, sizeSignal, contentContainerRef, initializers) {
    const clippingPlanes = createGlobalClippingPlanes(root, parentClippingRect, initializers);
    const depthAlign = computedProperty(propertiesSignal, 'depthAlign', defaultDepthAlign);
    const keepAspectRatio = computedProperty(propertiesSignal, 'keepAspectRatio', true);
    const measuredSize = new Vector3();
    const measuredCenter = new Vector3();
    const updateRenderProperties = (content, renderOrder, depthTest) => content?.traverse((object) => {
        if (!(object instanceof Mesh)) {
            return;
        }
        object.renderOrder = renderOrder;
        if (!(object.material instanceof Material)) {
            return;
        }
        object.material.depthTest = depthTest;
    });
    const measureContent = () => {
        const content = contentContainerRef.current;
        if (content == null) {
            measuredSize.copy(smallValue);
            measuredCenter.set(0, 0, 0);
            return;
        }
        content.traverse((object) => {
            if (object instanceof Mesh) {
                setupRenderOrder(object, root, orderInfo);
                object.material.clippingPlanes = clippingPlanes;
                object.material.needsUpdate = true;
                object.raycast = makeClippedRaycast(object, object.raycast, root.object, parentClippingRect, orderInfo);
            }
        });
        const parent = content.parent;
        content.parent = null;
        box3Helper.setFromObject(content);
        box3Helper.getSize(measuredSize).max(smallValue);
        sizeSignal.value = measuredSize;
        if (parent != null) {
            content.parent = parent;
        }
        box3Helper.getCenter(measuredCenter);
    };
    initializers.push(() => effect(() => updateRenderProperties(contentContainerRef.current, root.renderOrder.value, root.depthTest.value)), (subscriptions) => {
        const content = contentContainerRef.current;
        if (content == null) {
            return subscriptions;
        }
        measureContent();
        subscriptions.push(effect(() => {
            const { size: { value: size }, paddingInset: { value: paddingInset }, borderInset: { value: borderInset }, } = flexState;
            if (size == null || paddingInset == null || borderInset == null) {
                return;
            }
            const [width, height] = size;
            const [pTop, pRight, pBottom, pLeft] = paddingInset;
            const [bTop, bRight, bBottom, bLeft] = borderInset;
            const topInset = pTop + bTop;
            const rightInset = pRight + bRight;
            const bottomInset = pBottom + bBottom;
            const leftInset = pLeft + bLeft;
            const innerWidth = width - leftInset - rightInset;
            const innerHeight = height - topInset - bottomInset;
            const pixelSize = root.pixelSize.value;
            content.scale
                .set(innerWidth * pixelSize, innerHeight * pixelSize, keepAspectRatio.value ? (innerHeight * pixelSize * measuredSize.z) / measuredSize.y : measuredSize.z)
                .divide(measuredSize);
            content.position.copy(measuredCenter).negate();
            content.position.z -= alignmentZMap[depthAlign.value] * measuredSize.z;
            content.position.multiply(content.scale);
            content.position.add(vectorHelper.set((leftInset - rightInset) * 0.5 * pixelSize, (bottomInset - topInset) * 0.5 * pixelSize, 0));
            content.updateMatrix();
        }));
        return subscriptions;
    });
    return () => {
        updateRenderProperties(contentContainerRef.current, root.renderOrder.peek(), root.depthTest.peek());
        measureContent();
    };
}
