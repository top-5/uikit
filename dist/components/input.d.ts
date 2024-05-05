import { FlexNode, FlexNodeState, YogaProperties } from '../flex/index.js';
import { ScrollbarProperties } from '../scroll.js';
import { WithAllAliases } from '../properties/alias.js';
import { PanelProperties } from '../panel/instanced-panel.js';
import { TransformProperties } from '../transform.js';
import { AllOptionalProperties, WithClasses, WithReactive } from '../properties/index.js';
import { ZIndexProperties } from '../order.js';
import { Signal } from '@preact/signals-core';
import { VisibilityProperties, WithConditionals } from './utils.js';
import { Initializers } from '../utils.js';
import { Listeners } from '../listeners.js';
import { Object3DRef, ParentContext } from '../context.js';
import { PanelGroupProperties } from '../panel/instanced-panel-group.js';
import { EventHandlers } from '../events.js';
import { Vector2Tuple } from 'three';
import { CaretProperties } from '../caret.js';
import { SelectionProperties } from '../selection.js';
import { WithFocus } from '../focus.js';
import { FontFamilies, InstancedText, InstancedTextProperties } from '../text/index.js';
export type InheritableInputProperties = WithClasses<WithFocus<WithConditionals<WithAllAliases<WithReactive<YogaProperties & PanelProperties & ZIndexProperties & TransformProperties & ScrollbarProperties & CaretProperties & SelectionProperties & PanelGroupProperties & InstancedTextProperties & DisabledProperties & VisibilityProperties>>>>>;
export type DisabledProperties = {
    disabled?: boolean;
};
export declare const canvasInputProps: {
    onPointerDown: (e: {
        nativeEvent: any;
        preventDefault: () => void;
    }) => void;
};
export type InputProperties = InheritableInputProperties & Listeners & {
    onValueChange?: (value: string) => void;
} & WithReactive<{
    value?: string;
    tabIndex?: number;
    disabled?: boolean;
}> & {
    multiline?: boolean;
    defaultValue?: string;
};
export declare function createInput(parentContext: ParentContext, fontFamilies: Signal<FontFamilies | undefined>, style: Signal<InputProperties | undefined>, properties: Signal<InputProperties | undefined>, defaultProperties: Signal<AllOptionalProperties | undefined>, object: Object3DRef): {
    size: Signal<Vector2Tuple | undefined>;
    relativeCenter: Signal<Vector2Tuple | undefined>;
    borderInset: Signal<import("../flex/node.js").Inset | undefined>;
    overflow: Signal<import("yoga-layout/load").Overflow>;
    displayed: Signal<boolean>;
    scrollable: Signal<[boolean, boolean]>;
    paddingInset: Signal<import("../flex/node.js").Inset | undefined>;
    maxScrollPosition: Signal<[(number | undefined)?, (number | undefined)?]>;
} & {
    valueSignal: import("@preact/signals-core").ReadonlySignal<string>;
    focus: () => void;
    root: import("../context.js").RootContext;
    element: Signal<HTMLInputElement | HTMLTextAreaElement | undefined>;
    node: Signal<FlexNode | undefined>;
    interactionPanel: import("three").Mesh<import("three").BufferGeometry<import("three").NormalBufferAttributes>, import("three").Material | import("three").Material[], import("three").Object3DEventMap>;
    handlers: import("@preact/signals-core").ReadonlySignal<EventHandlers>;
    initializers: Initializers;
};
export declare function computedSelectionHandlers(flexState: FlexNodeState, instancedTextRef: {
    current?: InstancedText;
}, focus: (start?: number, end?: number, direction?: 'forward' | 'backward' | 'none') => void, disabled: Signal<boolean>): import("@preact/signals-core").ReadonlySignal<EventHandlers | undefined>;
export declare function createHtmlInputElement(value: Signal<string>, selectionRange: Signal<Vector2Tuple | undefined>, onChange: (value: string) => void, multiline: boolean, disabled: Signal<boolean>, tabIndex: Signal<number>, initializers: Initializers): Signal<HTMLInputElement | HTMLTextAreaElement | undefined>;
