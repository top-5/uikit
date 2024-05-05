import { Signal } from '@preact/signals-core';
import { Mesh, MeshBasicMaterial, PlaneGeometry, Texture, Vector2Tuple } from 'three';
import { Listeners } from '../index.js';
import { Object3DRef, ParentContext, RootContext } from '../context.js';
import { FlexNode, Inset, YogaProperties } from '../flex/index.js';
import { OrderInfo, ZIndexProperties } from '../order.js';
import { PanelGroupProperties, PanelProperties } from '../panel/index.js';
import { WithAllAliases } from '../properties/alias.js';
import { AllOptionalProperties, WithClasses, WithReactive } from '../properties/default.js';
import { ScrollbarProperties } from '../scroll.js';
import { TransformProperties } from '../transform.js';
import { VisibilityProperties, WithConditionals } from './utils.js';
import { Initializers } from '../utils.js';
import { AppearanceProperties } from './svg.js';
export type ImageFit = 'cover' | 'fill';
export type InheritableImageProperties = WithClasses<WithConditionals<WithAllAliases<WithReactive<YogaProperties & ZIndexProperties & Omit<PanelProperties, 'backgroundColor' | 'backgroundOpacity'> & TransformProperties & AppearanceProperties & PanelGroupProperties & ScrollbarProperties & KeepAspectRatioProperties & ImageFitProperties & VisibilityProperties>>>>;
export type ImageFitProperties = {
    objectFit?: ImageFit;
};
export type KeepAspectRatioProperties = {
    keepAspectRatio?: boolean;
};
export type ImageProperties = InheritableImageProperties & Listeners & WithReactive<{
    src?: string | Texture;
}>;
export declare function createImage(parentContext: ParentContext, style: Signal<ImageProperties | undefined>, properties: Signal<ImageProperties | undefined>, defaultProperties: Signal<AllOptionalProperties | undefined>, object: Object3DRef, childrenContainer: Object3DRef): {
    size: Signal<Vector2Tuple | undefined>;
    relativeCenter: Signal<Vector2Tuple | undefined>;
    borderInset: Signal<Inset | undefined>;
    overflow: Signal<import("yoga-layout/load").Overflow>;
    displayed: Signal<boolean>;
    scrollable: Signal<[boolean, boolean]>;
    paddingInset: Signal<Inset | undefined>;
    maxScrollPosition: Signal<[(number | undefined)?, (number | undefined)?]>;
} & {
    anyAncestorScrollable: import("@preact/signals-core").ReadonlySignal<readonly [boolean, boolean]>;
    initializers: Initializers;
    handlers: import("@preact/signals-core").ReadonlySignal<import("../events.js").EventHandlers>;
    interactionPanel: Mesh<PlaneGeometry, MeshBasicMaterial, import("three").Object3DEventMap>;
    clippingRect: Signal<import("../clipping.js").ClippingRect | undefined>;
    childrenMatrix: import("@preact/signals-core").ReadonlySignal<import("three").Matrix4 | undefined>;
    node: Signal<FlexNode | undefined>;
    orderInfo: Signal<OrderInfo | undefined>;
    root: RootContext;
};
