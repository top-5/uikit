import { Object3D } from 'three';
import { AllOptionalProperties } from '../properties/default.js';
import { IconProperties } from '../components/icon.js';
export declare class Icon extends Object3D {
    private readonly styleSignal;
    private readonly propertiesSignal;
    private readonly defaultPropertiesSignal;
    private readonly parentContextSignal;
    private readonly unsubscribe;
    constructor(text: string, svgWidth: number, svgHeight: number, properties?: IconProperties, defaultProperties?: AllOptionalProperties);
    setStyle(style: IconProperties | undefined): void;
    setProperties(properties: IconProperties | undefined): void;
    setDefaultProperties(properties: AllOptionalProperties): void;
    destroy(): void;
}
