import { Signal } from '@preact/signals-core';
import { Vector2Tuple } from 'three';
import { Initializers } from './utils.js';
import { ThreeEvent } from './events.js';
export type Listeners = ScrollListeners & LayoutListeners & ViewportListeners;
export type ScrollListeners = {
    /**
     * scroll listener called right before the new scroll position is set when a scroll event is caused
     * @param scrollX the new scroll x position
     * @param scrollY the new scroll y position
     * @param scrollPosition the current/old scroll position
     * @param event the event that caused the scrolling
     * @returns false to prevent the new scroll x and scroll y position from beeing applied
     */
    onScroll?: (scrollX: number, scrollY: number, scrollPosition: Signal<Vector2Tuple | undefined>, event?: ThreeEvent<WheelEvent | PointerEvent>) => boolean | void;
};
export type LayoutListeners = {
    onSizeChange?: (width: number, height: number) => void;
};
export type ViewportListeners = {
    onIsInViewportChange?: (isInViewport: boolean) => void;
};
export declare function setupLayoutListeners(l1: Signal<LayoutListeners | undefined>, l2: Signal<LayoutListeners | undefined>, size: Signal<Vector2Tuple | undefined>, initializers: Initializers): void;
export declare function setupViewportListeners(l1: Signal<ViewportListeners | undefined>, l2: Signal<ViewportListeners | undefined>, isVisible: Signal<boolean>, initializers: Initializers): void;
