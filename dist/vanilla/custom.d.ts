import { Object3D } from 'three';
import { AllOptionalProperties } from '../properties/default.js';
import { CustomContainerProperties } from '../components/index.js';
export declare class CustomContainer extends Object3D {
    private readonly styleSignal;
    private readonly propertiesSignal;
    private readonly defaultPropertiesSignal;
    private readonly parentContextSignal;
    private readonly unsubscribe;
    constructor(properties?: CustomContainerProperties, defaultProperties?: AllOptionalProperties);
    setStyle(style: CustomContainerProperties | undefined): void;
    setProperties(properties: CustomContainerProperties | undefined): void;
    setDefaultProperties(properties: AllOptionalProperties): void;
    destroy(): void;
}
