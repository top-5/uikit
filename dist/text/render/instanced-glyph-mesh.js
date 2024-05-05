import { Box3, Mesh, PlaneGeometry, Sphere } from 'three';
export class InstancedGlyphMesh extends Mesh {
    instanceMatrix;
    instanceRGBA;
    instanceUV;
    instanceClipping;
    count = 0;
    isInstancedMesh = true;
    instanceColor = null;
    morphTexture = null;
    boundingBox = new Box3();
    boundingSphere = new Sphere();
    constructor(instanceMatrix, instanceRGBA, instanceUV, instanceClipping, material) {
        const planeGeometry = new PlaneGeometry();
        planeGeometry.translate(0.5, -0.5, 0);
        super(planeGeometry, material);
        this.instanceMatrix = instanceMatrix;
        this.instanceRGBA = instanceRGBA;
        this.instanceUV = instanceUV;
        this.instanceClipping = instanceClipping;
        planeGeometry.attributes.instanceUVOffset = instanceUV;
        planeGeometry.attributes.instanceRGBA = instanceRGBA;
        planeGeometry.attributes.instanceClipping = instanceClipping;
        this.frustumCulled = false;
    }
    copy() {
        throw new Error('copy not implemented');
    }
    dispose() {
        this.dispatchEvent({ type: 'dispose' });
    }
    //functions not needed because intersection (and morphing) is intenionally disabled
    computeBoundingBox() { }
    computeBoundingSphere() { }
    updateMorphTargets() { }
    raycast() { }
    spherecast() { }
}
