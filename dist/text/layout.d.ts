import { Font } from './font.js';
import { Signal } from '@preact/signals-core';
import { MeasureFunction } from 'yoga-layout/load';
import { MergedProperties } from '../properties/merged.js';
export type GlyphLayoutLine = {
    charIndexOffset: number;
    charLength: number;
    nonWhitespaceCharLength: number;
    nonWhitespaceWidth: number;
    whitespacesBetween: number;
};
export type GlyphLayout = {
    lines: Array<GlyphLayoutLine>;
    availableWidth: number;
    availableHeight: number;
} & GlyphLayoutProperties;
export type GlyphProperties = Partial<Omit<GlyphLayoutProperties, 'text' | 'font'>>;
export type GlyphLayoutProperties = {
    text: string;
    font: Font;
    letterSpacing: number;
    lineHeight: number | `${number}%`;
    fontSize: number;
    wordBreak: keyof typeof wrappers;
};
export declare function computedMeasureFunc(properties: Signal<MergedProperties>, fontSignal: Signal<Font | undefined>, textSignal: Signal<string | Signal<string> | Array<Signal<string> | string>>, propertiesRef: {
    current: GlyphLayoutProperties | undefined;
}, defaultWordBreak: GlyphLayoutProperties['wordBreak']): import("@preact/signals-core").ReadonlySignal<MeasureFunction | undefined>;
declare const wrappers: {
    'keep-all': import("./wrapper/index.js").GlyphWrapper;
    'break-all': import("./wrapper/index.js").GlyphWrapper;
    'break-word': import("./wrapper/index.js").GlyphWrapper;
};
export declare function measureGlyphLayout(properties: GlyphLayoutProperties, availableWidth?: number): {
    width: number;
    height: number;
};
export declare function buildGlyphLayout(properties: GlyphLayoutProperties, availableWidth: number, availableHeight: number): GlyphLayout;
export {};
