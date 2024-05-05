import { effect } from '@preact/signals-core';
export function setupLayoutListeners(l1, l2, size, initializers) {
    let first = true;
    initializers.push(() => effect(() => {
        const s = size.value;
        if (s == null) {
            return;
        }
        if (first) {
            first = false;
            return;
        }
        l1.peek()?.onSizeChange?.(...s);
        l2.peek()?.onSizeChange?.(...s);
    }));
}
export function setupViewportListeners(l1, l2, isVisible, initializers) {
    let first = true;
    initializers.push(() => effect(() => {
        const isInViewport = isVisible.value;
        if (first) {
            first = false;
            return;
        }
        l1.peek()?.onIsInViewportChange?.(isInViewport);
        l2.peek()?.onIsInViewportChange?.(isInViewport);
    }));
}
