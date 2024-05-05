import { Signal } from '@preact/signals-core';
import { MergedProperties } from './merged.js';
export declare function computedProperty<T>(propertiesSignal: Signal<MergedProperties>, key: string, defaultValue: T): Signal<T>;
