import { createFlexNodeState } from '../flex/node.js';
import { createHoverPropertyTransformers, setupCursorCleanup } from '../hover.js';
import { computedIsClipped, createGlobalClippingPlanes } from '../clipping.js';
import { applyTransform, computedTransformMatrix } from '../transform.js';
import { createResponsivePropertyTransformers } from '../responsive.js';
import { ElementType, computedOrderInfo, setupRenderOrder } from '../order.js';
import { createActivePropertyTransfomers } from '../active.js';
import { effect, signal } from '@preact/signals-core';
import { computedGlobalMatrix, computedHandlers, computedIsVisible, computedMergedProperties, createNode, } from './utils.js';
import { setupLayoutListeners, setupViewportListeners } from '../listeners.js';
import { FrontSide, Material } from 'three';
import { darkPropertyTransformers } from '../dark.js';
import { makeClippedRaycast } from '../panel/index.js';
export function createCustomContainer(parentContext, style, properties, defaultProperties, object, meshRef) {
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
    const flexState = createFlexNodeState();
    createNode(undefined, flexState, parentContext, mergedProperties, object, initializers);
    //transform
    const transformMatrix = computedTransformMatrix(mergedProperties, flexState, parentContext.root.pixelSize);
    applyTransform(object, transformMatrix, initializers);
    const globalMatrix = computedGlobalMatrix(parentContext.childrenMatrix, transformMatrix);
    const isClipped = computedIsClipped(parentContext.clippingRect, globalMatrix, flexState.size, parentContext.root.pixelSize);
    const isVisible = computedIsVisible(flexState, isClipped, mergedProperties);
    //instanced panel
    const orderInfo = computedOrderInfo(mergedProperties, ElementType.Custom, undefined, parentContext.orderInfo);
    const clippingPlanes = createGlobalClippingPlanes(parentContext.root, parentContext.clippingRect, initializers);
    initializers.push((subscriptions) => {
        const mesh = meshRef.current;
        if (mesh == null) {
            return subscriptions;
        }
        mesh.matrixAutoUpdate = false;
        if (mesh.material instanceof Material) {
            const material = mesh.material;
            material.clippingPlanes = clippingPlanes;
            material.needsUpdate = true;
            material.shadowSide = FrontSide;
            subscriptions.push(() => effect(() => (material.depthTest = parentContext.root.depthTest.value)));
        }
        mesh.raycast = makeClippedRaycast(mesh, mesh.raycast, parentContext.root.object, parentContext.clippingRect, orderInfo);
        setupRenderOrder(mesh, parentContext.root, orderInfo);
        subscriptions.push(effect(() => (mesh.renderOrder = parentContext.root.renderOrder.value)), effect(() => (mesh.receiveShadow = mergedProperties.value.read('receiveShadow', false))), effect(() => (mesh.castShadow = mergedProperties.value.read('castShadow', false))), effect(() => {
            if (flexState.size.value == null) {
                return;
            }
            const [width, height] = flexState.size.value;
            const pixelSize = parentContext.root.pixelSize.value;
            mesh.scale.set(width * pixelSize, height * pixelSize, 1);
            mesh.updateMatrix();
        }), effect(() => void (mesh.visible = isVisible.value)));
        return subscriptions;
    });
    setupLayoutListeners(style, properties, flexState.size, initializers);
    setupViewportListeners(style, properties, isVisible, initializers);
    return Object.assign(flexState, {
        root: parentContext.root,
        handlers: computedHandlers(style, properties, defaultProperties, hoveredSignal, activeSignal),
        initializers,
    });
}
