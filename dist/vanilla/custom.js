import { Mesh, MeshBasicMaterial, Object3D } from 'three';
import { createParentContextSignal, setupParentContextSignal, bindHandlers } from './utils.js';
import { effect, signal } from '@preact/signals-core';
import { initialize, unsubscribeSubscriptions } from '../utils.js';
import { createCustomContainer } from '../components/index.js';
import { panelGeometry } from '../panel/index.js';
export class CustomContainer extends Object3D {
    styleSignal = signal(undefined);
    propertiesSignal;
    defaultPropertiesSignal;
    parentContextSignal = createParentContextSignal();
    unsubscribe;
    constructor(properties, defaultProperties) {
        super();
        this.matrixAutoUpdate = false;
        setupParentContextSignal(this.parentContextSignal, this);
        this.propertiesSignal = signal(properties);
        this.defaultPropertiesSignal = signal(defaultProperties);
        const mesh = new Mesh(panelGeometry, new MeshBasicMaterial());
        super.add(mesh);
        this.unsubscribe = effect(() => {
            const parentContext = this.parentContextSignal.value?.value;
            if (parentContext == null) {
                return;
            }
            const internals = createCustomContainer(parentContext, this.styleSignal, this.propertiesSignal, this.defaultPropertiesSignal, {
                current: this,
            }, {
                current: mesh,
            });
            //setup events
            //TODO make the container the mesh
            const subscriptions = [];
            initialize(internals.initializers, subscriptions);
            bindHandlers(internals.handlers, this, subscriptions);
            return () => {
                this.remove(mesh);
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
