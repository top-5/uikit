import { computed, effect, signal } from '@preact/signals-core';
import { Mesh, MeshBasicMaterial, SRGBColorSpace, Texture, TextureLoader, } from 'three';
import { createFlexNodeState } from '../flex/index.js';
import { ElementType, computedOrderInfo, setupRenderOrder } from '../order.js';
import { PanelDepthMaterial, PanelDistanceMaterial, createPanelMaterial, createPanelMaterialConfig, panelGeometry, } from '../panel/index.js';
import { applyScrollPosition, computedGlobalScrollMatrix, createScrollPosition, createScrollbars, computedScrollHandlers, computedAnyAncestorScrollable, } from '../scroll.js';
import { applyTransform, computedTransformMatrix } from '../transform.js';
import { computedGlobalMatrix, computedHandlers, computedIsVisible, computedMergedProperties, createNode, keepAspectRatioPropertyTransformer, loadResourceWithParams, } from './utils.js';
import { readReactive, unsubscribeSubscriptions } from '../utils.js';
import { setupImmediateProperties } from '../properties/immediate.js';
import { makeClippedRaycast, makePanelRaycast } from '../panel/interaction-panel-mesh.js';
import { computedIsClipped, computedClippingRect, createGlobalClippingPlanes } from '../clipping.js';
import { setupLayoutListeners, setupViewportListeners } from '../listeners.js';
import { computedProperty } from '../properties/batched.js';
import { createActivePropertyTransfomers } from '../active.js';
import { createHoverPropertyTransformers, setupCursorCleanup } from '../hover.js';
import { createResponsivePropertyTransformers } from '../responsive.js';
import { darkPropertyTransformers } from '../dark.js';
const defaultImageFit = 'fill';
export function createImage(parentContext, style, properties, defaultProperties, object, childrenContainer) {
    const initializers = [];
    const texture = signal(undefined);
    const hoveredSignal = signal([]);
    const activeSignal = signal([]);
    setupCursorCleanup(hoveredSignal, initializers);
    const src = computed(() => readReactive(style.value?.src) ?? readReactive(properties.value?.src));
    loadResourceWithParams(texture, loadTextureImpl, initializers, src);
    const textureAspectRatio = computed(() => {
        const tex = texture.value;
        if (tex == null) {
            return undefined;
        }
        const image = tex.source.data;
        return image.width / image.height;
    });
    const mergedProperties = computedMergedProperties(style, properties, defaultProperties, {
        ...darkPropertyTransformers,
        ...createResponsivePropertyTransformers(parentContext.root.size),
        ...createHoverPropertyTransformers(hoveredSignal),
        ...createActivePropertyTransfomers(activeSignal),
    }, keepAspectRatioPropertyTransformer, (m) => m.add('aspectRatio', textureAspectRatio));
    const node = signal(undefined);
    const flexState = createFlexNodeState();
    createNode(node, flexState, parentContext, mergedProperties, object, initializers);
    const transformMatrix = computedTransformMatrix(mergedProperties, flexState, parentContext.root.pixelSize);
    applyTransform(object, transformMatrix, initializers);
    const globalMatrix = computedGlobalMatrix(parentContext.childrenMatrix, transformMatrix);
    const isClipped = computedIsClipped(parentContext.clippingRect, globalMatrix, flexState.size, parentContext.root.pixelSize);
    const isHidden = computed(() => isClipped.value || texture.value == null);
    const isVisible = computedIsVisible(flexState, isHidden, mergedProperties);
    const orderInfo = computedOrderInfo(mergedProperties, ElementType.Image, undefined, parentContext.orderInfo);
    const scrollPosition = createScrollPosition();
    applyScrollPosition(childrenContainer, scrollPosition, parentContext.root.pixelSize, initializers);
    const childrenMatrix = computedGlobalScrollMatrix(scrollPosition, globalMatrix, parentContext.root.pixelSize);
    createScrollbars(mergedProperties, scrollPosition, flexState, globalMatrix, isVisible, parentContext.clippingRect, orderInfo, parentContext.root.panelGroupManager, initializers);
    const scrollHandlers = computedScrollHandlers(scrollPosition, parentContext.anyAncestorScrollable, flexState, object, properties, parentContext.root.pixelSize, parentContext.root.onFrameSet, initializers);
    setupLayoutListeners(style, properties, flexState.size, initializers);
    setupViewportListeners(style, properties, isClipped, initializers);
    return Object.assign(flexState, {
        anyAncestorScrollable: computedAnyAncestorScrollable(flexState.scrollable, parentContext.anyAncestorScrollable),
        initializers,
        handlers: computedHandlers(style, properties, defaultProperties, hoveredSignal, activeSignal, scrollHandlers),
        interactionPanel: createImageMesh(mergedProperties, texture, parentContext, flexState, orderInfo, parentContext.root, isVisible, initializers),
        clippingRect: computedClippingRect(globalMatrix, flexState, parentContext.root.pixelSize, parentContext.clippingRect),
        childrenMatrix,
        node,
        orderInfo,
        root: parentContext.root,
    });
}
let imageMaterialConfig;
function getImageMaterialConfig() {
    imageMaterialConfig ??= createPanelMaterialConfig({
        borderBend: 'borderBend',
        borderBottomLeftRadius: 'borderBottomLeftRadius',
        borderBottomRightRadius: 'borderBottomRightRadius',
        borderColor: 'borderColor',
        borderOpacity: 'borderOpacity',
        borderTopLeftRadius: 'borderTopLeftRadius',
        borderTopRightRadius: 'borderTopRightRadius',
        backgroundOpacity: 'opacity',
    }, {
        backgroundColor: 0xffffff,
    });
    return imageMaterialConfig;
}
function createImageMesh(propertiesSignal, texture, parent, flexState, orderInfo, root, isVisible, initializers) {
    const mesh = new Mesh(panelGeometry);
    mesh.matrixAutoUpdate = false;
    const clippingPlanes = createGlobalClippingPlanes(root, parent.clippingRect, initializers);
    const isMeshVisible = getImageMaterialConfig().computedIsVisibile(propertiesSignal, flexState.borderInset, flexState.size, isVisible);
    setupImageMaterials(propertiesSignal, mesh, flexState.size, flexState.borderInset, isMeshVisible, clippingPlanes, root, initializers);
    mesh.raycast = makeClippedRaycast(mesh, makePanelRaycast(mesh), root.object, parent.clippingRect, orderInfo);
    setupRenderOrder(mesh, root, orderInfo);
    setupTextureFit(propertiesSignal, texture, flexState.borderInset, flexState.size, initializers);
    initializers.push(() => effect(() => (mesh.visible = isMeshVisible.value)));
    initializers.push(() => effect(() => {
        const map = texture.value ?? null;
        if (mesh.material.map === map) {
            return;
        }
        mesh.material.map = map;
        mesh.material.needsUpdate = true;
    }), () => effect(() => {
        if (flexState.size.value == null) {
            return;
        }
        const [width, height] = flexState.size.value;
        const pixelSize = parent.root.pixelSize.value;
        mesh.scale.set(width * pixelSize, height * pixelSize, 1);
        mesh.updateMatrix();
    }));
    return mesh;
}
function setupTextureFit(propertiesSignal, textureSignal, borderInset, size, initializers) {
    const objectFit = computedProperty(propertiesSignal, 'objectFit', defaultImageFit);
    initializers.push(() => effect(() => {
        const texture = textureSignal.value;
        if (texture == null || size.value == null || borderInset.value == null) {
            return;
        }
        texture.matrix.identity();
        if (objectFit.value === 'fill' || texture == null) {
            transformInsideBorder(borderInset, size, texture);
            return;
        }
        const { width: textureWidth, height: textureHeight } = texture.source.data;
        const textureRatio = textureWidth / textureHeight;
        const [width, height] = size.value;
        const [top, right, bottom, left] = borderInset.value;
        const boundsRatioValue = (width - left - right) / (height - top - bottom);
        if (textureRatio > boundsRatioValue) {
            texture.matrix
                .translate(-(0.5 * (boundsRatioValue - textureRatio)) / boundsRatioValue, 0)
                .scale(boundsRatioValue / textureRatio, 1);
        }
        else {
            texture.matrix
                .translate(0, -(0.5 * (textureRatio - boundsRatioValue)) / textureRatio)
                .scale(1, textureRatio / boundsRatioValue);
        }
        transformInsideBorder(borderInset, size, texture);
    }));
}
function transformInsideBorder(borderInset, size, texture) {
    if (size.value == null || borderInset.value == null) {
        return;
    }
    const [outerWidth, outerHeight] = size.value;
    const [top, right, bottom, left] = borderInset.value;
    const width = outerWidth - left - right;
    const height = outerHeight - top - bottom;
    texture.matrix
        .translate(-1 + (left + width) / outerWidth, -1 + (top + height) / outerHeight)
        .scale(outerWidth / width, outerHeight / height);
}
const textureLoader = new TextureLoader();
async function loadTextureImpl(src) {
    if (src == null) {
        return Promise.resolve(undefined);
    }
    if (src instanceof Texture) {
        return Promise.resolve(src);
    }
    try {
        const texture = await textureLoader.loadAsync(src);
        texture.colorSpace = SRGBColorSpace;
        texture.matrixAutoUpdate = false;
        return texture;
    }
    catch (error) {
        console.error(error);
        return undefined;
    }
}
function setupImageMaterials(propertiesSignal, target, size, borderInset, isVisible, clippingPlanes, root, initializers) {
    const data = new Float32Array(16);
    const info = { data: data, type: 'normal' };
    target.customDepthMaterial = new PanelDepthMaterial(info);
    target.customDistanceMaterial = new PanelDistanceMaterial(info);
    target.customDepthMaterial.clippingPlanes = clippingPlanes;
    target.customDistanceMaterial.clippingPlanes = clippingPlanes;
    const panelMaterialClass = computedProperty(propertiesSignal, 'panelMaterialClass', MeshBasicMaterial);
    initializers.push((subscriptions) => {
        subscriptions.push(effect(() => {
            const material = createPanelMaterial(panelMaterialClass.value, info);
            material.clippingPlanes = clippingPlanes;
            target.material = material;
            return effect(() => (material.depthTest = root.depthTest.value));
        }), effect(() => (target.renderOrder = root.renderOrder.value)), effect(() => (target.castShadow = propertiesSignal.value.read('castShadow', false))), effect(() => (target.receiveShadow = propertiesSignal.value.read('receiveShadow', false))));
        return subscriptions;
    });
    const imageMaterialConfig = getImageMaterialConfig();
    const internalSubscriptions = [];
    initializers.push(() => effect(() => {
        if (!isVisible.value) {
            return;
        }
        data.set(imageMaterialConfig.defaultData);
        internalSubscriptions.push(effect(() => size.value != null && data.set(size.value, 13)), effect(() => borderInset.value != null && data.set(borderInset.value, 0)));
        return () => unsubscribeSubscriptions(internalSubscriptions);
    }));
    const setters = imageMaterialConfig.setters;
    initializers.push((subscriptions) => {
        setupImmediateProperties(propertiesSignal, isVisible, imageMaterialConfig.hasProperty, (key, value) => setters[key](data, 0, value, size, undefined), subscriptions);
        return subscriptions;
    });
}
