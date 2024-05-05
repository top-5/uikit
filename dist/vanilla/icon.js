import { Object3D } from 'three';
import { createParentContextSignal, setupParentContextSignal, bindHandlers } from './utils.js';
import { effect, signal } from '@preact/signals-core';
import { initialize, unsubscribeSubscriptions } from '../utils.js';
import { createIcon } from '../components/icon.js';
export class Icon extends Object3D {
    styleSignal = signal(undefined);
    propertiesSignal;
    defaultPropertiesSignal;
    parentContextSignal = createParentContextSignal();
    unsubscribe;
    constructor(text, svgWidth, svgHeight, properties, defaultProperties) {
        super();
        this.matrixAutoUpdate = false;
        setupParentContextSignal(this.parentContextSignal, this);
        this.propertiesSignal = signal(properties);
        this.defaultPropertiesSignal = signal(defaultProperties);
        this.unsubscribe = effect(() => {
            const parentContext = this.parentContextSignal.value?.value;
            if (parentContext == null) {
                return;
            }
            const internals = createIcon(parentContext, text, svgWidth, svgHeight, this.styleSignal, this.propertiesSignal, this.defaultPropertiesSignal, { current: this });
            super.add(internals.interactionPanel);
            super.add(internals.iconGroup);
            const subscriptions = [];
            initialize(internals.initializers, subscriptions);
            bindHandlers(internals.handlers, this, subscriptions);
            return () => {
                this.remove(internals.interactionPanel);
                this.remove(internals.iconGroup);
                unsubscribeSubscriptions(subscriptions);
            };
        });
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
