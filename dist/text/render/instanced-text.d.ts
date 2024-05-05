import { Signal } from '@preact/signals-core';
import { Matrix4, Vector2Tuple, Vector3Tuple } from 'three';
import { ClippingRect } from '../../clipping.js';
import { ColorRepresentation, Initializers, alignmentXMap, alignmentYMap } from '../../utils.js';
import { GlyphGroupManager, InstancedGlyphGroup } from './instanced-glyph-group.js';
import { GlyphLayout, GlyphLayoutProperties } from '../layout.js';
import { SelectionBoxes } from '../../selection.js';
import { OrderInfo } from '../../order.js';
import { Font } from '../font.js';
import { MergedProperties } from '../../properties/index.js';
import { FlexNode, FlexNodeState } from '../../flex/index.js';
export type TextAlignProperties = {
    textAlign?: keyof typeof alignmentXMap | 'block';
    verticalAlign?: keyof typeof alignmentYMap;
};
export type TextAppearanceProperties = {
    color?: ColorRepresentation;
    opacity?: number;
};
export declare function createInstancedText(properties: Signal<MergedProperties>, textSignal: Signal<string | Signal<string> | Array<string | Signal<string>>>, matrix: Signal<Matrix4 | undefined>, nodeSignal: Signal<FlexNode | undefined>, flexState: FlexNodeState, isVisible: Signal<boolean>, parentClippingRect: Signal<ClippingRect | undefined> | undefined, orderInfo: Signal<OrderInfo | undefined>, fontSignal: Signal<Font | undefined>, glyphGroupManager: GlyphGroupManager, selectionRange: Signal<Vector2Tuple | undefined> | undefined, selectionBoxes: Signal<SelectionBoxes> | undefined, caretPosition: Signal<Vector3Tuple | undefined> | undefined, instancedTextRef: {
    current?: InstancedText;
} | undefined, initializers: Initializers, defaultWordBreak: GlyphLayoutProperties['wordBreak']): import("@preact/signals-core").ReadonlySignal<import("yoga-layout/load").MeasureFunction | undefined>;
export declare class InstancedText {
    private group;
    private textAlign;
    private verticalAlign;
    private color;
    private opacity;
    private layoutSignal;
    private matrix;
    private parentClippingRect;
    private selectionRange;
    private selectionBoxes;
    private caretPosition;
    private glyphLines;
    private lastLayout;
    private unsubscribeInitialList;
    private unsubscribeShowList;
    constructor(group: InstancedGlyphGroup, textAlign: Signal<keyof typeof alignmentXMap | 'block'>, verticalAlign: Signal<keyof typeof alignmentYMap>, color: Signal<ColorRepresentation>, opacity: Signal<number>, layoutSignal: Signal<GlyphLayout | undefined>, matrix: Signal<Matrix4 | undefined>, isVisible: Signal<boolean>, parentClippingRect: Signal<ClippingRect | undefined> | undefined, selectionRange: Signal<Vector2Tuple | undefined> | undefined, selectionBoxes: Signal<SelectionBoxes> | undefined, caretPosition: Signal<Vector3Tuple | undefined> | undefined);
    getCharIndex(x: number, y: number): number;
    private updateSelectionBoxes;
    private computeSelectionBox;
    private getGlyphLineAndX;
    private getGlyphX;
    private show;
    private hide;
    destroy(): void;
}
