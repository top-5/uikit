/**
 * @requires that the element is attached to the dom if "autoplay" is active
 */
export function updateVideoElement(element, src, autoplay = false, volume = 1, preservesPitch = true, playbackRate = 1, muted = false, loop = false) {
    if (autoplay) {
        element.style.position = 'absolute';
        element.style.width = '1px';
        element.style.zIndex = '-1000';
        element.style.top = '0px';
        element.style.left = '0px';
    }
    element.playsInline = true;
    element.volume = volume ?? 1;
    element.preservesPitch = preservesPitch ?? true;
    element.playbackRate = playbackRate ?? 1;
    element.muted = muted ?? false;
    element.loop = loop ?? false;
    element.autoplay = autoplay ?? false;
    //update src
    if (src == null) {
        element.removeAttribute('src');
        element.removeAttribute('srcObject');
        return;
    }
    if (typeof src === 'string') {
        element.src = src;
    }
    else {
        element.srcObject = src;
    }
}
