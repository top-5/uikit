import { ContainerProperties } from '../components/container.js';
import { AllOptionalProperties } from '../properties/default.js';
import { Parent } from './utils.js';
export declare class Container extends Parent {
    private readonly styleSignal;
    private readonly propertiesSignal;
    private readonly defaultPropertiesSignal;
    private readonly parentContextSignal;
    private readonly unsubscribe;
    constructor(properties?: ContainerProperties, defaultProperties?: AllOptionalProperties);
    setStyle(style: ContainerProperties | undefined): void;
    setProperties(properties: ContainerProperties | undefined): void;
    setDefaultProperties(properties: AllOptionalProperties): void;
    destroy(): void;
}
