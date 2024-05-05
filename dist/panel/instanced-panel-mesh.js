import { Box3, Mesh, Sphere } from 'three';
import { createPanelGeometry, panelGeometry } from './utils.js';
import { instancedPanelDepthMaterial, instancedPanelDistanceMaterial } from './panel-material.js';
import { effect } from '@preact/signals-core';
import { makeClippedRaycast, makePanelRaycast } from './interaction-panel-mesh.js';
export function createInteractionPanel(orderInfo, rootContext, parentClippingRect, size, initializers) {
    const panel = new Mesh(panelGeometry);
    panel.matrixAutoUpdate = false;
    panel.raycast = makeClippedRaycast(panel, makePanelRaycast(panel), rootContext.object, parentClippingRect, orderInfo);
    panel.visible = false;
    initializers.push(() => effect(() => {
        if (size.value == null) {
            return;
        }
        const [width, height] = size.value;
        const pixelSize = rootContext.pixelSize.value;
        panel.scale.set(width * pixelSize, height * pixelSize, 1);
        panel.updateMatrix();
    }));
    return panel;
}
export class InstancedPanelMesh extends Mesh {
    instanceMatrix;
    count = 0;
    isInstancedMesh = true;
    instanceColor = null;
    morphTexture = null;
    boundingBox = new Box3();
    boundingSphere = new Sphere();
    constructor(instanceMatrix, instanceData, instanceClipping) {
        const panelGeometry = createPanelGeometry();
        super(panelGeometry);
        this.instanceMatrix = instanceMatrix;
        this.frustumCulled = false;
        panelGeometry.attributes.aData = instanceData;
        panelGeometry.attributes.aClipping = instanceClipping;
        this.customDepthMaterial = instancedPanelDepthMaterial;
        this.customDistanceMaterial = instancedPanelDistanceMaterial;
    }
    dispose() {
        this.dispatchEvent({ type: 'dispose' });
    }
    copy() {
        throw new Error('copy not implemented');
    }
    //functions not needed because intersection (and morphing) is intenionally disabled
    computeBoundingBox() { }
    computeBoundingSphere() { }
    updateMorphTargets() { }
    raycast() { }
    spherecast() { }
}
