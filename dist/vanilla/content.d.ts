import { Object3D, Object3DEventMap } from 'three';
import { AllOptionalProperties } from '../properties/default.js';
import { EventMap } from './utils.js';
import { ContentProperties } from '../components/index.js';
export declare class Content extends Object3D<EventMap & {
    childadded: {};
    childremoved: {};
}> {
    private readonly contentContainer;
    private readonly styleSignal;
    private readonly propertiesSignal;
    private readonly defaultPropertiesSignal;
    private readonly contentSubscriptions;
    private readonly parentContextSignal;
    private readonly unsubscribe;
    constructor(properties?: ContentProperties, defaultProperties?: AllOptionalProperties);
    add(...objects: Object3D<Object3DEventMap>[]): this;
    remove(...objects: Array<Object3D>): this;
    setStyle(style: ContentProperties | undefined): void;
    setProperties(properties: ContentProperties | undefined): void;
    setDefaultProperties(properties: AllOptionalProperties): void;
    destroy(): void;
}
