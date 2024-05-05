import { Box3, InstancedBufferAttribute, Mesh, Sphere, Vector2Tuple } from 'three';
import { Signal } from '@preact/signals-core';
import { Initializers } from '../utils.js';
import { OrderInfo } from '../order.js';
import { ClippingRect } from '../clipping.js';
import { RootContext } from '../context.js';
export declare function createInteractionPanel(orderInfo: Signal<OrderInfo | undefined>, rootContext: RootContext, parentClippingRect: Signal<ClippingRect | undefined> | undefined, size: Signal<Vector2Tuple | undefined>, initializers: Initializers): Mesh;
export declare class InstancedPanelMesh extends Mesh {
    readonly instanceMatrix: InstancedBufferAttribute;
    count: number;
    protected readonly isInstancedMesh = true;
    readonly instanceColor: null;
    readonly morphTexture: null;
    readonly boundingBox: Box3;
    readonly boundingSphere: Sphere;
    constructor(instanceMatrix: InstancedBufferAttribute, instanceData: InstancedBufferAttribute, instanceClipping: InstancedBufferAttribute);
    dispose(): void;
    copy(): this;
    computeBoundingBox(): void;
    computeBoundingSphere(): void;
    updateMorphTargets(): void;
    raycast(): void;
    spherecast(): void;
}
