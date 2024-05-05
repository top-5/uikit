import { Image } from './image.js';
import { VideoTexture } from 'three';
import { signal } from '@preact/signals-core';
import { updateVideoElement } from '../components/index.js';
export class VideoContainer extends Image {
    element;
    texture;
    aspectRatio;
    updateAspectRatio;
    constructor({ src, autoplay, volume, preservesPitch, playbackRate, muted, loop, ...rest } = {}, defaultProperties) {
        const element = document.createElement('video');
        if (autoplay) {
            document.body.append(element);
        }
        updateVideoElement(element, src, autoplay, volume, preservesPitch, playbackRate, muted, loop);
        const texture = new VideoTexture(element);
        const aspectRatio = signal(1);
        super({ aspectRatio, src: texture, ...rest }, defaultProperties);
        this.element = element;
        this.texture = texture;
        this.aspectRatio = aspectRatio;
        this.updateAspectRatio = () => (aspectRatio.value = this.element.videoWidth / this.element.videoHeight);
        this.updateAspectRatio();
        this.element.addEventListener('resize', this.updateAspectRatio);
    }
    setProperties({ src, autoplay, volume, preservesPitch, playbackRate, muted, loop, ...rest }) {
        if (autoplay) {
            this.element.remove();
            document.body.append(this.element);
        }
        updateVideoElement(this.element, src, autoplay, volume, preservesPitch, playbackRate, muted, loop);
        super.setProperties({
            aspectRatio: this.aspectRatio,
            src: this.texture,
            ...rest,
        });
    }
    destroy() {
        super.destroy();
        this.texture.dispose();
        this.element.remove();
        this.element.removeEventListener('resize', this.updateAspectRatio);
    }
}
