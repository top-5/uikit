import { Signal } from '@preact/signals-core';
import { Group, Mesh } from 'three';
import { Listeners } from '../index.js';
import { Object3DRef, ParentContext } from '../context.js';
import { YogaProperties } from '../flex/index.js';
import { ZIndexProperties } from '../order.js';
import { PanelProperties } from '../panel/instanced-panel.js';
import { WithAllAliases } from '../properties/alias.js';
import { AllOptionalProperties, WithClasses, WithReactive } from '../properties/default.js';
import { ScrollbarProperties } from '../scroll.js';
import { TransformProperties } from '../transform.js';
import { VisibilityProperties, WithConditionals } from './utils.js';
import { Initializers } from '../utils.js';
import { AppearanceProperties } from './svg.js';
import { PanelGroupProperties } from '../panel/index.js';
export type InheritableIconProperties = WithClasses<WithConditionals<WithAllAliases<WithReactive<YogaProperties & ZIndexProperties & PanelProperties & AppearanceProperties & TransformProperties & PanelGroupProperties & ScrollbarProperties & VisibilityProperties>>>>;
export type IconProperties = InheritableIconProperties & Listeners;
export declare function createIcon(parentContext: ParentContext, text: string, svgWidth: number, svgHeight: number, style: Signal<IconProperties | undefined>, properties: Signal<IconProperties | undefined>, defaultProperties: Signal<AllOptionalProperties | undefined>, object: Object3DRef): {
    size: Signal<import("three").Vector2Tuple | undefined>;
    relativeCenter: Signal<import("three").Vector2Tuple | undefined>;
    borderInset: Signal<import("../flex/node.js").Inset | undefined>;
    overflow: Signal<import("yoga-layout/load").Overflow>;
    displayed: Signal<boolean>;
    scrollable: Signal<[boolean, boolean]>;
    paddingInset: Signal<import("../flex/node.js").Inset | undefined>;
    maxScrollPosition: Signal<[(number | undefined)?, (number | undefined)?]>;
} & {
    initializers: Initializers;
    iconGroup: Group<import("three").Object3DEventMap>;
    handlers: import("@preact/signals-core").ReadonlySignal<import("../events.js").EventHandlers>;
    interactionPanel: Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>;
};
