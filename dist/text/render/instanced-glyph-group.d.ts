import { InstancedBufferAttribute } from 'three';
import { InstancedGlyph } from './instanced-glyph.js';
import { Font } from '../font.js';
import { OrderInfo, WithCameraDistance } from '../../order.js';
import { Object3DRef, RootContext } from '../../context.js';
import { Signal } from '@preact/signals-core';
import { Initializers } from '../../utils.js';
export declare class GlyphGroupManager {
    private renderOrder;
    private depthTest;
    private pixelSize;
    private root;
    private object;
    private map;
    constructor(renderOrder: Signal<number>, depthTest: Signal<boolean>, pixelSize: Signal<number>, root: WithCameraDistance & Pick<RootContext, 'onFrameSet'>, object: Object3DRef, initializers: Initializers);
    private traverse;
    getGroup(majorIndex: number, font: Font): InstancedGlyphGroup;
}
export declare class InstancedGlyphGroup {
    private renderOrder;
    private object;
    readonly pixelSize: Signal<number>;
    private readonly rootCameraDistance;
    private orderInfo;
    instanceMatrix: InstancedBufferAttribute;
    instanceUV: InstancedBufferAttribute;
    instanceRGBA: InstancedBufferAttribute;
    instanceClipping: InstancedBufferAttribute;
    private glyphs;
    private requestedGlyphs;
    private holeIndicies;
    private mesh?;
    private instanceMaterial;
    private timeTillDecimate?;
    constructor(renderOrder: number, depthTest: boolean, object: Object3DRef, font: Font, pixelSize: Signal<number>, rootCameraDistance: WithCameraDistance, orderInfo: OrderInfo);
    setDepthTest(depthTest: boolean): void;
    setRenderOrder(renderOrder: number): void;
    requestActivate(glyph: InstancedGlyph): void;
    delete(glyph: InstancedGlyph): void;
    onFrame(delta: number): void;
    private resize;
}
