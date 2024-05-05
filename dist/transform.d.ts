import { Signal } from '@preact/signals-core';
import { Matrix4 } from 'three';
import { FlexNodeState } from './flex/node.js';
import { Initializers, alignmentXMap, alignmentYMap } from './utils.js';
import { MergedProperties } from './properties/merged.js';
import { Object3DRef } from './context.js';
export type TransformProperties = {
    transformTranslateX?: number;
    transformTranslateY?: number;
    transformTranslateZ?: number;
    transformRotateX?: number;
    transformRotateY?: number;
    transformRotateZ?: number;
    transformScaleX?: number;
    transformScaleY?: number;
    transformScaleZ?: number;
    transformOriginX?: keyof typeof alignmentXMap;
    transformOriginY?: keyof typeof alignmentYMap;
};
export declare function computedTransformMatrix(propertiesSignal: Signal<MergedProperties>, { relativeCenter, size }: FlexNodeState, pixelSizeSignal: Signal<number>): Signal<Matrix4 | undefined>;
export declare function applyTransform(object: Object3DRef, transformMatrix: Signal<Matrix4 | undefined>, initializers: Initializers): void;