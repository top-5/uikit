import { Signal } from '@preact/signals-core';
import { Group, Mesh } from 'three';
import { Listeners } from '../index.js';
import { Object3DRef, ParentContext, RootContext } from '../context.js';
import { FlexNode, YogaProperties } from '../flex/index.js';
import { OrderInfo, ZIndexProperties } from '../order.js';
import { PanelProperties } from '../panel/instanced-panel.js';
import { WithAllAliases } from '../properties/alias.js';
import { AllOptionalProperties, WithClasses, WithReactive } from '../properties/default.js';
import { ScrollbarProperties } from '../scroll.js';
import { TransformProperties } from '../transform.js';
import { VisibilityProperties, WithConditionals } from './utils.js';
import { ColorRepresentation, Initializers } from '../utils.js';
import { ClippingRect } from '../clipping.js';
import { PanelGroupProperties } from '../panel/index.js';
import { KeepAspectRatioProperties } from './image.js';
export type InheritableSvgProperties = WithClasses<WithConditionals<WithAllAliases<WithReactive<YogaProperties & ZIndexProperties & PanelProperties & AppearanceProperties & KeepAspectRatioProperties & TransformProperties & PanelGroupProperties & ScrollbarProperties & VisibilityProperties>>>>;
export type AppearanceProperties = {
    opacity?: number;
    color?: ColorRepresentation;
};
export type SvgProperties = InheritableSvgProperties & Listeners & {
    src?: Signal<string> | string;
    keepAspectRatio?: boolean;
};
export declare function createSvg(parentContext: ParentContext, style: Signal<SvgProperties | undefined>, properties: Signal<SvgProperties | undefined>, defaultProperties: Signal<AllOptionalProperties | undefined>, object: Object3DRef, childrenContainer: Object3DRef): {
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
    clippingRect: Signal<ClippingRect | undefined>;
    childrenMatrix: import("@preact/signals-core").ReadonlySignal<import("three").Matrix4 | undefined>;
    node: Signal<FlexNode | undefined>;
    orderInfo: Signal<OrderInfo | undefined>;
    root: RootContext;
    initializers: Initializers;
    centerGroup: Group<import("three").Object3DEventMap>;
    handlers: import("@preact/signals-core").ReadonlySignal<import("../events.js").EventHandlers>;
    interactionPanel: Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>;
};
