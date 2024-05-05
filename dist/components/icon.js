import { effect, signal } from '@preact/signals-core';
import { Group, Mesh, MeshBasicMaterial, ShapeGeometry } from 'three';
import { createFlexNodeState } from '../flex/index.js';
import { ElementType, computedOrderInfo, setupRenderOrder } from '../order.js';
import { createInstancedPanel } from '../panel/instanced-panel.js';
import { applyTransform, computedTransformMatrix } from '../transform.js';
import { applyAppearancePropertiesToGroup, computedGlobalMatrix, computedHandlers, computedIsVisible, computedMergedProperties, createNode, keepAspectRatioPropertyTransformer, } from './utils.js';
import { fitNormalizedContentInside } from '../utils.js';
import { makeClippedRaycast } from '../panel/interaction-panel-mesh.js';
import { computedIsClipped, createGlobalClippingPlanes } from '../clipping.js';
import { setupLayoutListeners, setupViewportListeners } from '../listeners.js';
import { createActivePropertyTransfomers } from '../active.js';
import { createHoverPropertyTransformers, setupCursorCleanup } from '../hover.js';
import { createInteractionPanel } from '../panel/instanced-panel-mesh.js';
import { createResponsivePropertyTransformers } from '../responsive.js';
import { SVGLoader } from 'three/examples/jsm/Addons.js';
import { computedPanelGroupDependencies, getDefaultPanelMaterialConfig } from '../panel/index.js';
import { darkPropertyTransformers } from '../dark.js';
export function createIcon(parentContext, text, svgWidth, svgHeight, style, properties, defaultProperties, object) {
    const initializers = [];
    const hoveredSignal = signal([]);
    const activeSignal = signal([]);
    setupCursorCleanup(hoveredSignal, initializers);
    const mergedProperties = computedMergedProperties(style, properties, defaultProperties, {
        ...darkPropertyTransformers,
        ...createResponsivePropertyTransformers(parentContext.root.size),
        ...createHoverPropertyTransformers(hoveredSignal),
        ...createActivePropertyTransfomers(activeSignal),
    }, keepAspectRatioPropertyTransformer, (m) => {
        m.add('aspectRatio', svgWidth / svgHeight);
        m.add('width', svgWidth);
        m.add('height', svgHeight);
    });
    const flexState = createFlexNodeState();
    createNode(undefined, flexState, parentContext, mergedProperties, object, initializers);
    const transformMatrix = computedTransformMatrix(mergedProperties, flexState, parentContext.root.pixelSize);
    applyTransform(object, transformMatrix, initializers);
    const globalMatrix = computedGlobalMatrix(parentContext.childrenMatrix, transformMatrix);
    const isClipped = computedIsClipped(parentContext.clippingRect, globalMatrix, flexState.size, parentContext.root.pixelSize);
    const isVisible = computedIsVisible(flexState, isClipped, mergedProperties);
    const groupDeps = computedPanelGroupDependencies(mergedProperties);
    const backgroundOrderInfo = computedOrderInfo(mergedProperties, ElementType.Panel, groupDeps, parentContext.orderInfo);
    initializers.push((subscriptions) => createInstancedPanel(mergedProperties, backgroundOrderInfo, groupDeps, parentContext.root.panelGroupManager, globalMatrix, flexState.size, undefined, flexState.borderInset, parentContext.clippingRect, isVisible, getDefaultPanelMaterialConfig(), subscriptions));
    const orderInfo = computedOrderInfo(undefined, ElementType.Svg, undefined, backgroundOrderInfo);
    const clippingPlanes = createGlobalClippingPlanes(parentContext.root, parentContext.clippingRect, initializers);
    const iconGroup = createIconGroup(mergedProperties, text, svgWidth, svgHeight, parentContext, orderInfo, flexState, isVisible, clippingPlanes, initializers);
    setupLayoutListeners(style, properties, flexState.size, initializers);
    setupViewportListeners(style, properties, isVisible, initializers);
    return Object.assign(flexState, {
        initializers,
        iconGroup,
        handlers: computedHandlers(style, properties, defaultProperties, hoveredSignal, activeSignal),
        interactionPanel: createInteractionPanel(orderInfo, parentContext.root, parentContext.clippingRect, flexState.size, initializers),
    });
}
const loader = new SVGLoader();
function createIconGroup(propertiesSignal, text, svgWidth, svgHeight, parentContext, orderInfo, flexState, isVisible, clippingPlanes, initializers) {
    const group = new Group();
    group.matrixAutoUpdate = false;
    const result = loader.parse(text);
    for (const path of result.paths) {
        const shapes = SVGLoader.createShapes(path);
        const material = new MeshBasicMaterial();
        material.transparent = true;
        material.depthWrite = false;
        material.toneMapped = false;
        material.clippingPlanes = clippingPlanes;
        for (const shape of shapes) {
            const geometry = new ShapeGeometry(shape);
            geometry.computeBoundingBox();
            const mesh = new Mesh(geometry, material);
            mesh.matrixAutoUpdate = false;
            mesh.raycast = makeClippedRaycast(mesh, mesh.raycast, parentContext.root.object, parentContext.clippingRect, orderInfo);
            setupRenderOrder(mesh, parentContext.root, orderInfo);
            mesh.userData.color = path.color;
            mesh.scale.y = -1;
            mesh.updateMatrix();
            group.add(mesh);
        }
    }
    const aspectRatio = svgWidth / svgHeight;
    initializers.push(() => effect(() => {
        fitNormalizedContentInside(group.position, group.scale, flexState.size, flexState.paddingInset, flexState.borderInset, parentContext.root.pixelSize.value, aspectRatio);
        group.position.x -= (group.scale.x * aspectRatio) / 2;
        group.position.y += group.scale.x / 2;
        group.scale.divideScalar(svgHeight);
        group.updateMatrix();
    }), () => effect(() => void (group.visible = isVisible.value)));
    applyAppearancePropertiesToGroup(propertiesSignal, group, initializers, parentContext.root);
    return group;
}
