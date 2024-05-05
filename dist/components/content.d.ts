import { YogaProperties } from '../flex/node.js';
import { ScrollbarProperties } from '../scroll.js';
import { WithAllAliases } from '../properties/alias.js';
import { PanelProperties } from '../panel/instanced-panel.js';
import { TransformProperties } from '../transform.js';
import { AllOptionalProperties, WithClasses, WithReactive } from '../properties/default.js';
import { ZIndexProperties } from '../order.js';
import { Signal } from '@preact/signals-core';
import { VisibilityProperties, WithConditionals } from './utils.js';
import { Initializers, alignmentZMap } from '../utils.js';
import { Listeners } from '../listeners.js';
import { Object3DRef, ParentContext } from '../context.js';
import { PanelGroupProperties } from '../panel/instanced-panel-group.js';
import { Material, Mesh } from 'three';
import { KeepAspectRatioProperties } from './image.js';
export type InheritableContentProperties = WithClasses<WithConditionals<WithAllAliases<WithReactive<YogaProperties & PanelProperties & ZIndexProperties & TransformProperties & ScrollbarProperties & PanelGroupProperties & DepthAlignProperties & KeepAspectRatioProperties & VisibilityProperties>>>>;
export type DepthAlignProperties = {
    depthAlign?: keyof typeof alignmentZMap;
};
export type ContentProperties = InheritableContentProperties & Listeners;
export declare function createContent(parentContext: ParentContext, style: Signal<ContentProperties | undefined>, properties: Signal<ContentProperties | undefined>, defaultProperties: Signal<AllOptionalProperties | undefined>, object: Object3DRef, contentContainerRef: Object3DRef): {
    size: Signal<import("three").Vector2Tuple | undefined>;
    relativeCenter: Signal<import("three").Vector2Tuple | undefined>;
    borderInset: Signal<import("../flex/node.js").Inset | undefined>;
    overflow: Signal<import("yoga-layout/load").Overflow>;
    displayed: Signal<boolean>;
    scrollable: Signal<[boolean, boolean]>;
    paddingInset: Signal<import("../flex/node.js").Inset | undefined>;
    maxScrollPosition: Signal<[(number | undefined)?, (number | undefined)?]>;
} & {
    remeasureContent: () => void;
    interactionPanel: Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, Material | Material[], import("three").Object3DEventMap>;
    handlers: import("@preact/signals-core").ReadonlySignal<import("../events.js").EventHandlers>;
    initializers: Initializers;
};
