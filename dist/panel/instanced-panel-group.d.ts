import { InstancedBufferAttribute } from 'three';
import { MaterialClass } from './panel-material.js';
import { InstancedPanel } from './instanced-panel.js';
import { OrderInfo, WithCameraDistance } from '../order.js';
import { Signal } from '@preact/signals-core';
import { MergedProperties } from '../properties/merged.js';
import { Object3DRef, RootContext } from '../context.js';
import { Initializers } from '../utils.js';
export type ShadowProperties = {
    receiveShadow?: boolean;
    castShadow?: boolean;
};
export type PanelGroupProperties = {
    panelMaterialClass?: MaterialClass;
} & ShadowProperties;
export declare function computedPanelGroupDependencies(propertiesSignal: Signal<MergedProperties>): import("@preact/signals-core").ReadonlySignal<Required<PanelGroupProperties>>;
export declare const defaultPanelDependencies: Required<PanelGroupProperties>;
export declare class PanelGroupManager {
    private renderOrder;
    private depthTest;
    private pixelSize;
    private root;
    private object;
    private map;
    constructor(renderOrder: Signal<number>, depthTest: Signal<boolean>, pixelSize: Signal<number>, root: WithCameraDistance & Pick<RootContext, 'onFrameSet'>, object: Object3DRef, initializers: Initializers);
    private traverse;
    getGroup(majorIndex: number, { panelMaterialClass, receiveShadow, castShadow }?: Required<PanelGroupProperties>): InstancedPanelGroup;
}
export declare class InstancedPanelGroup {
    private renderOrder;
    private readonly object;
    readonly pixelSize: Signal<number>;
    private readonly root;
    private readonly orderInfo;
    private readonly meshReceiveShadow;
    private readonly meshCastShadow;
    private mesh?;
    instanceMatrix: InstancedBufferAttribute;
    instanceData: InstancedBufferAttribute;
    instanceClipping: InstancedBufferAttribute;
    private readonly instanceMaterial;
    private buckets;
    private elementCount;
    private bufferElementSize;
    private timeToNextUpdate;
    instanceDataOnUpdate: InstancedBufferAttribute['addUpdateRange'];
    private activateElement;
    private setElementIndex;
    private bufferCopyWithin;
    private clearBufferAt;
    constructor(renderOrder: number, depthTest: boolean, object: Object3DRef, materialClass: MaterialClass, pixelSize: Signal<number>, root: WithCameraDistance, orderInfo: OrderInfo, meshReceiveShadow: boolean, meshCastShadow: boolean);
    private updateCount;
    setDepthTest(depthTest: boolean): void;
    setRenderOrder(renderOrder: number): void;
    insert(bucketIndex: number, panel: InstancedPanel): void;
    delete(bucketIndex: number, elementIndex: number | undefined, panel: InstancedPanel): void;
    onFrame(delta: number): void;
    private requestUpdate;
    private update;
    private resize;
}
