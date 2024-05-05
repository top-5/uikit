import { Object3D } from 'three';
import { createParentContextSignal, setupParentContextSignal, bindHandlers } from './utils.js';
import { effect, signal } from '@preact/signals-core';
import { createText } from '../components/text.js';
import { initialize, unsubscribeSubscriptions } from '../utils.js';
export class Text extends Object3D {
    styleSignal = signal(undefined);
    propertiesSignal;
    defaultPropertiesSignal;
    textSignal;
    parentContextSignal = createParentContextSignal();
    unsubscribe;
    constructor(text = '', properties, defaultProperties) {
        super();
        this.matrixAutoUpdate = false;
        setupParentContextSignal(this.parentContextSignal, this);
        this.propertiesSignal = signal(properties);
        this.defaultPropertiesSignal = signal(defaultProperties);
        this.textSignal = signal(text);
        this.unsubscribe = effect(() => {
            const parentContext = this.parentContextSignal.value?.value;
            if (parentContext == null) {
                return;
            }
            const internals = createText(parentContext, this.textSignal, parentContext.fontFamiliesSignal, this.styleSignal, this.propertiesSignal, this.defaultPropertiesSignal, { current: this });
            super.add(internals.interactionPanel);
            const subscriptions = [];
            initialize(internals.initializers, subscriptions);
            bindHandlers(internals.handlers, this, subscriptions);
            return () => {
                this.remove(internals.interactionPanel);
                unsubscribeSubscriptions(subscriptions);
            };
        });
    }
    setText(text) {
        this.textSignal.value = text;
    }
    setStyle(style) {
        this.styleSignal.value = style;
    }
    setProperties(properties) {
        this.propertiesSignal.value = properties;
    }
    setDefaultProperties(properties) {
        this.defaultPropertiesSignal.value = properties;
    }
    destroy() {
        this.parent?.remove(this);
        this.unsubscribe();
    }
}
