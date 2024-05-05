import { Object3D } from 'three';
import { createParentContextSignal, setupParentContextSignal, bindHandlers } from './utils.js';
import { effect, signal } from '@preact/signals-core';
import { initialize, unsubscribeSubscriptions } from '../utils.js';
import { createContent } from '../components/index.js';
export class Content extends Object3D {
    contentContainer;
    styleSignal = signal(undefined);
    propertiesSignal;
    defaultPropertiesSignal;
    contentSubscriptions = [];
    parentContextSignal = createParentContextSignal();
    unsubscribe;
    constructor(properties, defaultProperties) {
        super();
        this.matrixAutoUpdate = false;
        setupParentContextSignal(this.parentContextSignal, this);
        this.propertiesSignal = signal(properties);
        this.defaultPropertiesSignal = signal(defaultProperties);
        //setting up the threejs elements
        this.contentContainer = new Object3D();
        this.contentContainer.matrixAutoUpdate = false;
        super.add(this.contentContainer);
        this.unsubscribe = effect(() => {
            const parentContext = this.parentContextSignal.value?.value;
            if (parentContext == null) {
                return;
            }
            const internals = createContent(parentContext, this.styleSignal, this.propertiesSignal, this.defaultPropertiesSignal, {
                current: this,
            }, {
                current: this.contentContainer,
            });
            //setup events
            super.add(internals.interactionPanel);
            const subscriptions = [];
            initialize(internals.initializers, subscriptions);
            bindHandlers(internals.handlers, this, subscriptions);
            this.addEventListener('childadded', internals.remeasureContent);
            this.addEventListener('childremoved', internals.remeasureContent);
            return () => {
                this.remove(internals.interactionPanel);
                unsubscribeSubscriptions(subscriptions);
                this.removeEventListener('childadded', internals.remeasureContent);
                this.removeEventListener('childremoved', internals.remeasureContent);
            };
        });
    }
    add(...objects) {
        const objectsLength = objects.length;
        for (let i = 0; i < objectsLength; i++) {
            const object = objects[i];
            this.contentContainer.add(object);
        }
        return this;
    }
    remove(...objects) {
        const objectsLength = objects.length;
        for (let i = 0; i < objectsLength; i++) {
            const object = objects[i];
            this.contentContainer.remove(object);
        }
        return this;
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
        unsubscribeSubscriptions(this.contentSubscriptions);
        this.unsubscribe();
    }
}
