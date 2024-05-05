import { Signal, computed, effect } from '@preact/signals-core';
import { Color, Mesh } from 'three';
import { addActiveHandlers } from '../active.js';
import { addHoverHandlers } from '../hover.js';
import { readReactive } from '../utils.js';
import { FlexNode } from '../flex/index.js';
import { MergedProperties, computedProperty, } from '../properties/index.js';
export function computedGlobalMatrix(parentMatrix, localMatrix) {
    return computed(() => {
        const local = localMatrix.value;
        const parent = parentMatrix.value;
        if (local == null || parent == null) {
            return undefined;
        }
        return parent.clone().multiply(local);
    });
}
export function computedIsVisible(flexState, isClipped, mergedProperties) {
    return computed(() => flexState.displayed.value &&
        (isClipped == null || !isClipped?.value) &&
        mergedProperties.value.read('visibility', 'visible') === 'visible');
}
export function loadResourceWithParams(target, fn, initializers, param, ...additionals) {
    initializers.push((subscriptions) => {
        if (!(param instanceof Signal)) {
            let canceled = false;
            fn(param, ...additionals).then((value) => (canceled ? undefined : (target.value = value)));
            subscriptions.push(() => (canceled = true));
            return subscriptions;
        }
        subscriptions.push(effect(() => {
            let canceled = false;
            fn(param.value, ...additionals)
                .then((value) => (canceled ? undefined : (target.value = value)))
                .catch(console.error);
            return () => (canceled = true);
        }));
        return subscriptions;
    });
}
export function createNode(target, state, parentContext, mergedProperties, object, initializers) {
    initializers.push((subscriptions) => {
        const node = new FlexNode(state, mergedProperties, parentContext.root.requestCalculateLayout, object, subscriptions);
        if (target != null) {
            target.value = node;
        }
        subscriptions.push(effect(() => {
            const parentNode = parentContext.node.value;
            if (parentNode == null) {
                return;
            }
            parentNode.addChild(node);
            return () => parentNode.removeChild(node);
        }));
        return subscriptions;
    });
}
const signalMap = new Map();
export const keepAspectRatioPropertyTransformer = {
    keepAspectRatio: (value, target) => {
        let signal = signalMap.get(value);
        if (signal == null) {
            //if keep aspect ratio is "false" => we write "null" => which overrides the previous properties and returns null
            signalMap.set(value, (signal = computed(() => (readReactive(value) === false ? null : undefined))));
        }
        target.add('aspectRatio', signal);
    },
};
export function computedHandlers(style, properties, defaultProperties, hoveredSignal, activeSignal, dynamicHandlers, defaultCursor) {
    return computed(() => {
        const handlers = {};
        addHandlers(handlers, dynamicHandlers?.value);
        addHoverHandlers(handlers, style.value, properties.value, defaultProperties.value, hoveredSignal, defaultCursor);
        addActiveHandlers(handlers, style.value, properties.value, defaultProperties.value, activeSignal);
        return handlers;
    });
}
export function addHandlers(target, handlers) {
    for (const key in handlers) {
        addHandler(key, target, handlers[key]);
    }
}
export function addHandler(key, target, handler) {
    if (handler == null) {
        return;
    }
    const existingHandler = target[key];
    if (existingHandler == null) {
        target[key] = handler;
        return;
    }
    target[key] = ((e) => {
        existingHandler(e);
        if ('stopped' in e && e.stopped) {
            return;
        }
        handler(e);
    });
}
export function computedMergedProperties(style, properties, defaultProperties, postTransformers, preTransformers, onInit) {
    return computed(() => {
        const merged = new MergedProperties(preTransformers);
        onInit?.(merged);
        merged.addAll(style.value, properties.value, defaultProperties.value, postTransformers);
        return merged;
    });
}
const colorHelper = new Color();
/**
 * @requires that each mesh inside the group has its default color stored inside object.userData.color
 */
export function applyAppearancePropertiesToGroup(propertiesSignal, group, initializers, root) {
    const color = computedProperty(propertiesSignal, 'color', undefined);
    const opacity = computedProperty(propertiesSignal, 'opacity', 1);
    initializers.push(() => effect(() => {
        let c;
        if (Array.isArray(color.value)) {
            c = colorHelper.setRGB(...color.value);
        }
        else if (color.value != null) {
            c = colorHelper.set(color.value);
        }
        readReactive(group)?.traverse((mesh) => {
            if (!(mesh instanceof Mesh)) {
                return;
            }
            mesh.renderOrder = root.renderOrder.value;
            const material = mesh.material;
            material.color.copy(c ?? mesh.userData.color);
            material.opacity = opacity.value;
            material.depthTest = root.depthTest.value;
        });
    }));
}
