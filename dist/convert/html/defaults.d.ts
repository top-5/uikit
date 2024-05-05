import { ConversionComponentData } from './internals.js';
export declare const htmlDefaults: Record<string, Partial<Omit<ConversionComponentData, 'hasProperty'>> & {
    renderAs?: 'Image' | 'Input' | 'VideoContainer' | 'Icon' | 'Container' | 'Text';
}>;
