import { AllOptionalProperties } from '../properties/default.js';
import { Parent } from './utils.js';
import { SvgProperties } from '../components/svg.js';
export declare class Svg extends Parent {
    private readonly styleSignal;
    private readonly propertiesSignal;
    private readonly defaultPropertiesSignal;
    private readonly parentContextSignal;
    private readonly unsubscribe;
    constructor(properties?: SvgProperties, defaultProperties?: AllOptionalProperties);
    setStyle(style: SvgProperties | undefined): void;
    setProperties(properties: SvgProperties | undefined): void;
    setDefaultProperties(properties: AllOptionalProperties): void;
    destroy(): void;
}
