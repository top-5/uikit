import { Camera, WebGLRenderer } from 'three';
import { Signal } from '@preact/signals-core';
import { AllOptionalProperties, WithReactive } from '../properties/index.js';
import { RootProperties } from '../components/root.js';
import { Parent } from './utils.js';
import { FontFamilies } from '../text/index.js';
export declare class Root extends Parent {
    private readonly styleSignal;
    private readonly propertiesSignal;
    private readonly defaultPropertiesSignal;
    private readonly unsubscribe;
    private readonly onFrameSet;
    private readonly fontFamiliesSignal;
    private readonly pixelSizeSignal;
    constructor(camera: Signal<Camera | undefined> | (() => Camera) | Camera, renderer: WebGLRenderer, properties?: RootProperties & WithReactive<{
        pixelSize?: number;
    }>, defaultProperties?: AllOptionalProperties, fontFamilies?: FontFamilies);
    update(delta: number): void;
    setFontFamilies(fontFamilies: FontFamilies | undefined): void;
    setStyle(style: RootProperties | undefined): void;
    setProperties(properties: (RootProperties & WithReactive<{
        pixelSize?: number;
    }>) | undefined): void;
    setDefaultProperties(properties: AllOptionalProperties): void;
    destroy(): void;
}
