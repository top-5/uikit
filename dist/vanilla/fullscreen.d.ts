import { WebGLRenderer } from 'three';
import { Root } from './root.js';
import { FullscreenProperties, RootProperties } from '../components/index.js';
import { AllOptionalProperties } from '../properties/index.js';
import { FontFamilies } from '../text/index.js';
export declare class Fullscreen extends Root {
    private renderer;
    private distanceToCamera?;
    private parentCameraSignal;
    private readonly sizeX;
    private readonly sizeY;
    private readonly pixelSize;
    private readonly transformTranslateZ;
    constructor(renderer: WebGLRenderer, distanceToCamera?: number | undefined, properties?: FullscreenProperties, defaultProperties?: AllOptionalProperties, fontFamilies?: FontFamilies);
    /**
     * must be called when the screen size changes
     */
    updateSize(): void;
    setStyle(style: Omit<RootProperties, 'sizeX' | 'sizeY' | 'pixelSize'> | undefined): void;
    setProperties(properties: Omit<RootProperties, 'sizeX' | 'sizeY' | 'pixelSize'> | undefined): void;
}
