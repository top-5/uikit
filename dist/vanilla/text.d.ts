import { Object3D } from 'three';
import { AllOptionalProperties } from '../properties/default.js';
import { Signal } from '@preact/signals-core';
import { TextProperties } from '../components/text.js';
export declare class Text extends Object3D {
    private readonly styleSignal;
    private readonly propertiesSignal;
    private readonly defaultPropertiesSignal;
    private readonly textSignal;
    private readonly parentContextSignal;
    private readonly unsubscribe;
    constructor(text?: string | Signal<string> | Array<string | Signal<string>>, properties?: TextProperties, defaultProperties?: AllOptionalProperties);
    setText(text: string | Signal<string> | Array<string | Signal<string>>): void;
    setStyle(style: TextProperties | undefined): void;
    setProperties(properties: TextProperties | undefined): void;
    setDefaultProperties(properties: AllOptionalProperties): void;
    destroy(): void;
}
