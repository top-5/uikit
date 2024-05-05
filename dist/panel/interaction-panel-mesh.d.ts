import { Mesh } from 'three';
import { ClippingRect } from '../clipping.js';
import { Signal } from '@preact/signals-core';
import { OrderInfo } from '../order.js';
import { Object3DRef } from '../context.js';
export declare function makePanelRaycast(mesh: Mesh): Mesh['raycast'];
export declare function makeClippedRaycast(mesh: Mesh, fn: Mesh['raycast'], rootObject: Object3DRef, clippingRect: Signal<ClippingRect | undefined> | undefined, orderInfo: Signal<OrderInfo | undefined>): Mesh['raycast'];
