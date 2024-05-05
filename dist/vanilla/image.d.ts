import { ImageProperties } from '../components/image.js';
import { AllOptionalProperties } from '../properties/default.js';
import { Parent } from './utils.js';
export declare class Image extends Parent {
    private readonly styleSignal;
    private readonly propertiesSignal;
    private readonly defaultPropertiesSignal;
    private readonly parentContextSignal;
    private readonly unsubscribe;
    constructor(properties?: ImageProperties, defaultProperties?: AllOptionalProperties);
    setStyle(style: ImageProperties | undefined): void;
    setProperties(properties: ImageProperties | undefined): void;
    setDefaultProperties(properties: AllOptionalProperties): void;
    destroy(): void;
}
