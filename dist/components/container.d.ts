import { FlexNode, YogaProperties } from '../flex/node.js';
import { ScrollbarProperties } from '../scroll.js';
import { WithAllAliases } from '../properties/alias.js';
import { PanelProperties } from '../panel/instanced-panel.js';
import { TransformProperties } from '../transform.js';
import { AllOptionalProperties, WithClasses, WithReactive } from '../properties/default.js';
import { ZIndexProperties } from '../order.js';
import { Signal } from '@preact/signals-core';
import { VisibilityProperties, WithConditionals } from './utils.js';
import { Listeners } from '../listeners.js';
import { Object3DRef, ParentContext } from '../context.js';
import { PanelGroupProperties } from '../panel/instanced-panel-group.js';
import { Initializers } from '../utils.js';
export type InheritableContainerProperties = WithClasses<WithConditionals<WithAllAliases<WithReactive<YogaProperties & PanelProperties & ZIndexProperties & TransformProperties & ScrollbarProperties & PanelGroupProperties & VisibilityProperties>>>>;
export type ContainerProperties = InheritableContainerProperties & Listeners;
export declare function createContainer(parentContext: ParentContext, style: Signal<ContainerProperties | undefined>, properties: Signal<ContainerProperties | undefined>, defaultProperties: Signal<AllOptionalProperties | undefined>, object: Object3DRef, childrenContainer: Object3DRef): {
    size: Signal<import("three").Vector2Tuple | undefined>;
    relativeCenter: Signal<import("three").Vector2Tuple | undefined>;
    borderInset: Signal<import("../flex/node.js").Inset | undefined>;
    overflow: Signal<import("yoga-layout/load").Overflow>;
    displayed: Signal<boolean>;
    scrollable: Signal<[boolean, boolean]>;
    paddingInset: Signal<import("../flex/node.js").Inset | undefined>;
    maxScrollPosition: Signal<[(number | undefined)?, (number | undefined)?]>;
} & {
    anyAncestorScrollable: import("@preact/signals-core").ReadonlySignal<readonly [boolean, boolean]>;
    clippingRect: Signal<import("../clipping.js").ClippingRect | undefined>;
    childrenMatrix: import("@preact/signals-core").ReadonlySignal<import("three").Matrix4 | undefined>;
    node: Signal<FlexNode | undefined>;
    orderInfo: Signal<import("../order.js").OrderInfo | undefined>;
    root: import("../context.js").RootContext;
    scrollPosition: Signal<import("three").Vector2Tuple>;
    interactionPanel: import("three").Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>;
    handlers: import("@preact/signals-core").ReadonlySignal<import("../events.js").EventHandlers>;
    initializers: Initializers;
};