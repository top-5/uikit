import { Signal } from '@preact/signals-core';
import { Subscriptions } from '../utils.js';
import { EventHandlers } from '../events.js';
import { Object3D, Object3DEventMap } from 'three';
import { ParentContext } from '../context.js';
import { FontFamilies } from '../text/index.js';
export declare function createParentContextSignal(): Signal<Signal<(Readonly<{
    node: Signal<import("../internals.js").FlexNode | undefined>;
    anyAncestorScrollable: Signal<readonly [boolean, boolean]>;
    clippingRect: Signal<import("../clipping.js").ClippingRect | undefined>;
    childrenMatrix: Signal<import("three").Matrix4 | undefined>;
    orderInfo: Signal<import("../order.js").OrderInfo | undefined>;
    root: import("../context.js").RootContext;
}> & {
    fontFamiliesSignal: Signal<FontFamilies | undefined>;
}) | undefined> | undefined>;
export declare function setupParentContextSignal(parentContextSignal: ReturnType<typeof createParentContextSignal>, container: Object3D): void;
export declare class Parent extends Object3D<EventMap> {
    readonly contextSignal: Signal<(ParentContext & {
        fontFamiliesSignal: Signal<FontFamilies | undefined>;
    }) | undefined>;
    protected readonly childrenContainer: Object3D<{
        childadded: {};
        childremoved: {};
    } & Object3DEventMap>;
    constructor();
    add(...objects: Array<Object3D>): this;
    addAt(object: Object3D, index: number): this;
    remove(...objects: Array<Object3D>): this;
}
export declare function bindHandlers(handlers: Signal<EventHandlers>, container: Object3D<EventMap>, subscriptions: Subscriptions): void;
export type EventMap = Object3DEventMap & {
    [Key in keyof EventHandlers as RemoveOn<Key>]: EventHandlers[Key];
};
type RemoveOn<T> = Uncapitalize<T extends `on${infer K}` ? K : never>;
export {};
