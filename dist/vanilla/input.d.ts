import { Object3D } from 'three';
import { AllOptionalProperties } from '../properties/default.js';
import { InputProperties } from '../components/input.js';
export declare class Input extends Object3D {
    private readonly styleSignal;
    private readonly propertiesSignal;
    private readonly defaultPropertiesSignal;
    private readonly parentContextSignal;
    private readonly unsubscribe;
    constructor(properties?: InputProperties, defaultProperties?: AllOptionalProperties);
    setStyle(style: InputProperties | undefined): void;
    setProperties(properties: InputProperties | undefined): void;
    setDefaultProperties(properties: AllOptionalProperties): void;
    destroy(): void;
}
