import { Image } from './image.js';
import { AllOptionalProperties, ImageProperties, VideoContainerProperties } from '../index.js';
export declare class VideoContainer extends Image {
    readonly element: HTMLVideoElement;
    private readonly texture;
    private readonly aspectRatio;
    private readonly updateAspectRatio;
    constructor({ src, autoplay, volume, preservesPitch, playbackRate, muted, loop, ...rest }?: VideoContainerProperties, defaultProperties?: AllOptionalProperties);
    setProperties({ src, autoplay, volume, preservesPitch, playbackRate, muted, loop, ...rest }: VideoContainerProperties & ImageProperties): void;
    destroy(): void;
}
