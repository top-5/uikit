import { Signal } from '@preact/signals-core';
import { Matrix4, Vector2Tuple } from 'three';
import { Bucket } from '../allocation/sorted-buckets.js';
import { ClippingRect } from '../clipping.js';
import { Inset } from '../flex/node.js';
import { InstancedPanelGroup, PanelGroupManager, PanelGroupProperties } from './instanced-panel-group.js';
import { ColorRepresentation, Subscriptions } from '../utils.js';
import { MergedProperties } from '../properties/merged.js';
import { OrderInfo } from '../order.js';
import { PanelMaterialConfig } from './index.js';
export type PanelProperties = {
    borderTopLeftRadius?: number;
    borderTopRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderBottomRightRadius?: number;
    backgroundOpacity?: number;
    backgroundColor?: ColorRepresentation;
    borderColor?: ColorRepresentation;
    borderBend?: number;
    borderOpacity?: number;
};
export declare function createInstancedPanel(propertiesSignal: Signal<MergedProperties>, orderInfo: Signal<OrderInfo | undefined>, panelGroupDependencies: Signal<Required<PanelGroupProperties>> | undefined, panelGroupManager: PanelGroupManager, matrix: Signal<Matrix4 | undefined>, size: Signal<Vector2Tuple | undefined>, offset: Signal<Vector2Tuple> | undefined, borderInset: Signal<Inset | undefined>, clippingRect: Signal<ClippingRect | undefined> | undefined, isVisible: Signal<boolean>, materialConfig: PanelMaterialConfig, subscriptions: Subscriptions): Subscriptions;
export declare class InstancedPanel {
    private group;
    private readonly minorIndex;
    private readonly matrix;
    private readonly size;
    private readonly offset;
    private readonly borderInset;
    private readonly clippingRect;
    readonly materialConfig: PanelMaterialConfig;
    private indexInBucket?;
    private bucket?;
    private unsubscribeList;
    private insertedIntoGroup;
    private active;
    constructor(propertiesSignal: Signal<MergedProperties>, group: InstancedPanelGroup, minorIndex: number, matrix: Signal<Matrix4 | undefined>, size: Signal<Vector2Tuple | undefined>, offset: Signal<Vector2Tuple> | undefined, borderInset: Signal<Inset | undefined>, clippingRect: Signal<ClippingRect | undefined> | undefined, isVisible: Signal<boolean>, materialConfig: PanelMaterialConfig, subscriptions: Subscriptions);
    setIndexInBucket(index: number): void;
    private getIndexInBuffer;
    activate(bucket: Bucket<unknown>, index: number): void;
    private requestShow;
    private hide;
}