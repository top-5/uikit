import { Parent, createParentContextSignal, bindHandlers } from './utils.js';
import { effect, signal } from '@preact/signals-core';
import { initialize, unsubscribeSubscriptions } from '../utils.js';
import { createSvg } from '../components/svg.js';
export class Svg extends Parent {
    styleSignal = signal(undefined);
    propertiesSignal;
    defaultPropertiesSignal;
    parentContextSignal = createParentContextSignal();
    unsubscribe;
    constructor(properties, defaultProperties) {
        super();
        this.matrixAutoUpdate = false;
        this.propertiesSignal = signal(properties);
        this.defaultPropertiesSignal = signal(defaultProperties);
        this.unsubscribe = effect(() => {
            const parentContext = this.parentContextSignal.value?.value;
            if (parentContext == null) {
                this.contextSignal.value = undefined;
                return;
            }
            const internals = createSvg(parentContext, this.styleSignal, this.propertiesSignal, this.defaultPropertiesSignal, { current: this }, { current: this.childrenContainer });
            this.contextSignal.value = Object.assign(internals, { fontFamiliesSignal: parentContext.fontFamiliesSignal });
            super.add(internals.interactionPanel);
            super.add(internals.centerGroup);
            const subscriptions = [];
            initialize(internals.initializers, subscriptions);
            bindHandlers(internals.handlers, this, subscriptions);
            return () => {
                this.remove(internals.interactionPanel);
                this.remove(internals.centerGroup);
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
