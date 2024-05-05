import { computed, effect, signal } from '@preact/signals-core';
import { Box3, Group, Mesh, MeshBasicMaterial, ShapeGeometry, Vector3 } from 'three';
import { createFlexNodeState } from '../flex/index.js';
import { ElementType, computedOrderInfo, setupRenderOrder } from '../order.js';
import { createInstancedPanel } from '../panel/instanced-panel.js';
import { applyScrollPosition, computedGlobalScrollMatrix, createScrollPosition, createScrollbars, computedScrollHandlers, computedAnyAncestorScrollable, } from '../scroll.js';
import { applyTransform, computedTransformMatrix } from '../transform.js';
import { applyAppearancePropertiesToGroup, computedGlobalMatrix, computedHandlers, computedIsVisible, computedMergedProperties, createNode, keepAspectRatioPropertyTransformer, loadResourceWithParams, } from './utils.js';
import { fitNormalizedContentInside, readReactive } from '../utils.js';
import { makeClippedRaycast } from '../panel/interaction-panel-mesh.js';
import { computedIsClipped, computedClippingRect, createGlobalClippingPlanes } from '../clipping.js';
import { setupLayoutListeners, setupViewportListeners } from '../listeners.js';
import { createActivePropertyTransfomers } from '../active.js';
import { createHoverPropertyTransformers, setupCursorCleanup } from '../hover.js';
import { createInteractionPanel } from '../panel/instanced-panel-mesh.js';
import { createResponsivePropertyTransformers } from '../responsive.js';
import { SVGLoader } from 'three/examples/jsm/Addons.js';
import { darkPropertyTransformers } from '../dark.js';
import { computedPanelGroupDependencies, getDefaultPanelMaterialConfig } from '../panel/index.js';
export function createSvg(parentContext, style, properties, defaultProperties, object, childrenContainer) {
    const initializers = [];
    const hoveredSignal = signal([]);
    const activeSignal = signal([]);
    setupCursorCleanup(hoveredSignal, initializers);
    const aspectRatio = signal(undefined);
    const mergedProperties = computedMergedProperties(style, properties, defaultProperties, {
        ...darkPropertyTransformers,
        ...createResponsivePropertyTransformers(parentContext.root.size),
        ...createHoverPropertyTransformers(hoveredSignal),
        ...createActivePropertyTransfomers(activeSignal),
    }, keepAspectRatioPropertyTransformer, (m) => m.add('aspectRatio', aspectRatio));
    const node = signal(undefined);
    const flexState = createFlexNodeState();
    createNode(node, flexState, parentContext, mergedProperties, object, initializers);
    const transformMatrix = computedTransformMatrix(mergedProperties, flexState, parentContext.root.pixelSize);
    applyTransform(object, transformMatrix, initializers);
    const globalMatrix = computedGlobalMatrix(parentContext.childrenMatrix, transformMatrix);
    const isClipped = computedIsClipped(parentContext.clippingRect, globalMatrix, flexState.size, parentContext.root.pixelSize);
    const isVisible = computedIsVisible(flexState, isClipped, mergedProperties);
    const groupDeps = computedPanelGroupDependencies(mergedProperties);
    const backgroundOrderInfo = computedOrderInfo(mergedProperties, ElementType.Panel, groupDeps, parentContext.orderInfo);
    initializers.push((subscriptions) => createInstancedPanel(mergedProperties, backgroundOrderInfo, groupDeps, parentContext.root.panelGroupManager, globalMatrix, flexState.size, undefined, flexState.borderInset, parentContext.clippingRect, isVisible, getDefaultPanelMaterialConfig(), subscriptions));
    const orderInfo = computedOrderInfo(undefined, ElementType.Svg, undefined, backgroundOrderInfo);
    const src = computed(() => readReactive(style.value?.src) ?? readReactive(properties.value?.src));
    const svgObject = signal(undefined);
    const clippingPlanes = createGlobalClippingPlanes(parentContext.root, parentContext.clippingRect, initializers);
    loadResourceWithParams(svgObject, loadSvg, initializers, src, parentContext.root, clippingPlanes, parentContext.clippingRect, orderInfo, aspectRatio);
    applyAppearancePropertiesToGroup(mergedProperties, svgObject, initializers, parentContext.root);
    const centerGroup = createCenterGroup(flexState, parentContext.root.pixelSize, svgObject, aspectRatio, isVisible, initializers);
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
        initializers,
        centerGroup,
        handlers: computedHandlers(style, properties, defaultProperties, hoveredSignal, activeSignal, scrollHandlers),
        interactionPanel: createInteractionPanel(orderInfo, parentContext.root, parentContext.clippingRect, flexState.size, initializers),
    });
}
function createCenterGroup(flexState, pixelSize, svgObject, aspectRatio, isVisible, initializers) {
    const centerGroup = new Group();
    centerGroup.matrixAutoUpdate = false;
    initializers.push(() => effect(() => {
        fitNormalizedContentInside(centerGroup.position, centerGroup.scale, flexState.size, flexState.paddingInset, flexState.borderInset, pixelSize.value, aspectRatio.value ?? 1);
        centerGroup.updateMatrix();
    }), () => effect(() => {
        const object = svgObject.value;
        if (object == null) {
            return;
        }
        centerGroup.add(object);
        return () => centerGroup.remove(object);
    }), () => effect(() => void (centerGroup.visible = svgObject.value != null && isVisible.value)));
    return centerGroup;
}
const loader = new SVGLoader();
const box3Helper = new Box3();
const vectorHelper = new Vector3();
async function loadSvg(url, root, clippingPlanes, clippedRect, orderInfo, aspectRatio) {
    if (url == null) {
        return undefined;
    }
    const object = new Group();
    object.matrixAutoUpdate = false;
    const result = await loader.loadAsync(url);
    box3Helper.makeEmpty();
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
            box3Helper.union(geometry.boundingBox);
            const mesh = new Mesh(geometry, material);
            mesh.matrixAutoUpdate = false;
            mesh.raycast = makeClippedRaycast(mesh, mesh.raycast, root.object, clippedRect, orderInfo);
            setupRenderOrder(mesh, root, orderInfo);
            mesh.userData.color = path.color;
            mesh.scale.y = -1;
            mesh.updateMatrix();
            object.add(mesh);
        }
    }
    box3Helper.getSize(vectorHelper);
    aspectRatio.value = vectorHelper.x / vectorHelper.y;
    const scale = 1 / vectorHelper.y;
    object.scale.set(1, 1, 1).multiplyScalar(scale);
    box3Helper.getCenter(vectorHelper);
    vectorHelper.y *= -1;
    object.position.copy(vectorHelper).negate().multiplyScalar(scale);
    object.updateMatrix();
    return object;
}
