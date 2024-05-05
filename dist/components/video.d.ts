import { ImageProperties } from './image.js';
export type VideoContainerProperties = Omit<ImageProperties, 'src'> & {
    src?: string | MediaStream;
    volume?: number;
    preservesPitch?: boolean;
    playbackRate?: number;
    muted?: boolean;
    loop?: boolean;
    autoplay?: boolean;
};
/**
 * @requires that the element is attached to the dom if "autoplay" is active
 */
export declare function updateVideoElement(element: HTMLVideoElement, src: string | MediaStream | undefined, autoplay?: boolean, volume?: number, preservesPitch?: boolean, playbackRate?: number, muted?: boolean, loop?: boolean): void;
