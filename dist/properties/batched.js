import { computed } from '@preact/signals-core';
export function computedProperty(propertiesSignal, key, defaultValue) {
    return computed(() => propertiesSignal.value.read(key, defaultValue));
}
