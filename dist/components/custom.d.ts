import { YogaProperties } from '../flex/node.js';
import { ScrollbarProperties } from '../scroll.js';
import { WithAllAliases } from '../properties/alias.js';
import { PanelProperties } from '../panel/instanced-panel.js';
import { TransformProperties } from '../transform.js';
import { AllOptionalProperties, WithClasses, WithReactive } from '../properties/default.js';
import { ZIndexProperties } from '../order.js';
import { Signal } from '@preact/signals-core';
import { VisibilityProperties, WithConditionals } from './utils.js';
import { Initializers } from '../utils.js';
import { Listeners } from '../listeners.js';
import { Object3DRef, ParentContext } from '../context.js';
import { Mesh } from 'three';
import { ShadowProperties } from '../panel/index.js';
export type InheritableCustomContainerProperties = WithClasses<WithConditionals<WithAllAliases<WithReactive<YogaProperties & PanelProperties & ZIndexProperties & TransformProperties & ScrollbarProperties & ShadowProperties & VisibilityProperties>>>>;
export type CustomContainerProperties = InheritableCustomContainerProperties & Listeners;
export declare function createCustomContainer(parentContext: ParentContext, style: Signal<CustomContainerProperties | undefined>, properties: Signal<CustomContainerProperties | undefined>, defaultProperties: Signal<AllOptionalProperties | undefined>, object: Object3DRef, meshRef: {
    current?: Mesh | null;
}): {
    size: Signal<import("three").Vector2Tuple | undefined>;
    relativeCenter: Signal<import("three").Vector2Tuple | undefined>;
    borderInset: Signal<import("../flex/node.js").Inset | undefined>;
    overflow: Signal<import("yoga-layout/load").Overflow>;
    displayed: Signal<boolean>;
    scrollable: Signal<[boolean, boolean]>;
    paddingInset: Signal<import("../flex/node.js").Inset | undefined>;
    maxScrollPosition: Signal<[(number | undefined)?, (number | undefined)?]>;
} & {
    root: import("../context.js").RootContext;
    handlers: import("@preact/signals-core").ReadonlySignal<import("../events.js").EventHandlers>;
    initializers: Initializers;
};
