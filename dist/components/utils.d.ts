import { Signal } from '@preact/signals-core';
import { Matrix4, Object3D } from 'three';
import { WithActive } from '../active.js';
import { WithPreferredColorScheme } from '../dark.js';
import { WithHover } from '../hover.js';
import { WithResponsive } from '../responsive.js';
import { Initializers } from '../utils.js';
import { FlexNode, FlexNodeState } from '../flex/index.js';
import { ParentContext, Object3DRef, RootContext } from '../context.js';
import { EventHandlers } from '../events.js';
import { AllOptionalProperties, MergedProperties, Properties, PropertyTransformers } from '../properties/index.js';
export declare function computedGlobalMatrix(parentMatrix: Signal<Matrix4 | undefined>, localMatrix: Signal<Matrix4 | undefined>): Signal<Matrix4 | undefined>;
export type VisibilityProperties = {
    visibility?: 'visible' | 'hidden';
};
export declare function computedIsVisible(flexState: FlexNodeState, isClipped: Signal<boolean> | undefined, mergedProperties: Signal<MergedProperties>): import("@preact/signals-core").ReadonlySignal<boolean>;
export type WithConditionals<T> = WithHover<T> & WithResponsive<T> & WithPreferredColorScheme<T> & WithActive<T>;
export declare function loadResourceWithParams<P, R, A extends Array<unknown>>(target: Signal<R | undefined>, fn: (param: P, ...additional: A) => Promise<R>, initializers: Initializers, param: Signal<P> | P, ...additionals: A): void;
export declare function createNode(target: Signal<FlexNode | undefined> | undefined, state: FlexNodeState, parentContext: ParentContext, mergedProperties: Signal<MergedProperties>, object: Object3DRef, initializers: Initializers): void;
export declare const keepAspectRatioPropertyTransformer: PropertyTransformers;
export declare function computedHandlers(style: Signal<Properties | undefined>, properties: Signal<Properties | undefined>, defaultProperties: Signal<AllOptionalProperties | undefined>, hoveredSignal: Signal<Array<number>>, activeSignal: Signal<Array<number>>, dynamicHandlers?: Signal<EventHandlers | undefined>, defaultCursor?: string): import("@preact/signals-core").ReadonlySignal<EventHandlers>;
export declare function addHandlers(target: EventHandlers, handlers: EventHandlers | undefined): void;
export declare function addHandler<T extends {
    [Key in string]?: (e: any) => void;
}, K extends keyof T>(key: K, target: T, handler: T[K]): void;
export declare function computedMergedProperties(style: Signal<Properties | undefined>, properties: Signal<Properties | undefined>, defaultProperties: Signal<AllOptionalProperties | undefined>, postTransformers: PropertyTransformers, preTransformers?: PropertyTransformers, onInit?: (merged: MergedProperties) => void): import("@preact/signals-core").ReadonlySignal<MergedProperties>;
/**
 * @requires that each mesh inside the group has its default color stored inside object.userData.color
 */
export declare function applyAppearancePropertiesToGroup(propertiesSignal: Signal<MergedProperties>, group: Signal<Object3D | undefined> | Object3D, initializers: Initializers, root: RootContext): void;
