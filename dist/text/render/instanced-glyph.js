import { Matrix4 } from 'three';
import { defaultClippingData } from '../../clipping.js';
import { glyphIntoToUV } from '../font.js';
import { computed } from '@preact/signals-core';
import { writeColor } from '../../panel/index.js';
const helperMatrix1 = new Matrix4();
const helperMatrix2 = new Matrix4();
export function computedGylphGroupDependencies(fontSignal) {
    return computed(() => ({ font: fontSignal.value }));
}
/**
 * renders an initially specified glyph
 */
export class InstancedGlyph {
    group;
    baseMatrix;
    color;
    opacity;
    clippingRect;
    index;
    hidden = true;
    glyphInfo;
    x = 0;
    y = 0;
    fontSize = 0;
    pixelSize = 0;
    constructor(group, 
    //modifiable using update...
    baseMatrix, color, opacity, clippingRect) {
        this.group = group;
        this.baseMatrix = baseMatrix;
        this.color = color;
        this.opacity = opacity;
        this.clippingRect = clippingRect;
    }
    getX(widthMultiplier) {
        if (this.glyphInfo == null) {
            return this.x;
        }
        return this.x + widthMultiplier * this.glyphInfo.width * this.fontSize;
    }
    show() {
        if (!this.hidden) {
            return;
        }
        this.hidden = false;
        this.group.requestActivate(this);
    }
    hide() {
        if (this.hidden) {
            return;
        }
        this.hidden = true;
        this.group.delete(this);
    }
    activate(index) {
        this.index = index;
        this.writeUpdatedMatrix();
        this.writeUV();
        this.updateColor(this.color);
        this.updateOpacity(this.opacity);
        this.updateClippingRect(this.clippingRect);
    }
    setIndex(index) {
        this.index = index;
    }
    updateClippingRect(clippingRect) {
        this.clippingRect = clippingRect;
        if (this.index == null) {
            return;
        }
        const offset = this.index * 16;
        const { instanceClipping } = this.group;
        if (this.clippingRect == null) {
            instanceClipping.set(defaultClippingData, offset);
        }
        else {
            this.clippingRect.toArray(instanceClipping.array, offset);
        }
        instanceClipping.addUpdateRange(offset, 16);
        instanceClipping.needsUpdate = true;
    }
    updateColor(color) {
        this.color = color;
        if (this.index == null) {
            return;
        }
        const { instanceRGBA } = this.group;
        const offset = instanceRGBA.itemSize * this.index;
        writeColor(instanceRGBA.array, offset, color, undefined);
        instanceRGBA.addUpdateRange(offset, 3);
        instanceRGBA.needsUpdate = true;
    }
    updateOpacity(opacity) {
        this.opacity = opacity;
        if (this.index == null) {
            return;
        }
        const { instanceRGBA } = this.group;
        const bufferIndex = this.index * 4 + 3;
        instanceRGBA.array[bufferIndex] = opacity;
        instanceRGBA.addUpdateRange(bufferIndex, 1);
        instanceRGBA.needsUpdate = true;
    }
    updateGlyphAndTransformation(glyphInfo, x, y, fontSize, pixelSize) {
        if (this.glyphInfo === glyphInfo &&
            this.x === x &&
            this.y === y &&
            this.fontSize === fontSize &&
            this.pixelSize === pixelSize) {
            return;
        }
        if (this.glyphInfo != glyphInfo) {
            this.glyphInfo = glyphInfo;
            this.writeUV();
        }
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.pixelSize = pixelSize;
        this.writeUpdatedMatrix();
    }
    updateBaseMatrix(baseMatrix) {
        if (this.baseMatrix === baseMatrix) {
            return;
        }
        this.baseMatrix = baseMatrix;
        this.writeUpdatedMatrix();
    }
    writeUV() {
        if (this.index == null || this.glyphInfo == null) {
            return;
        }
        const offset = this.index * 4;
        const { instanceUV } = this.group;
        glyphIntoToUV(this.glyphInfo, instanceUV.array, offset);
        instanceUV.addUpdateRange(offset, 4);
        instanceUV.needsUpdate = true;
    }
    writeUpdatedMatrix() {
        if (this.index == null || this.glyphInfo == null || this.baseMatrix == null) {
            return;
        }
        const offset = this.index * 16;
        const { instanceMatrix } = this.group;
        instanceMatrix.addUpdateRange(offset, 16);
        helperMatrix1
            .makeTranslation(this.x * this.pixelSize, this.y * this.pixelSize, 0)
            .multiply(helperMatrix2.makeScale(this.fontSize * this.glyphInfo.width * this.pixelSize, this.fontSize * this.glyphInfo.height * this.pixelSize, 1))
            .premultiply(this.baseMatrix);
        helperMatrix1.toArray(instanceMatrix.array, offset);
        instanceMatrix.needsUpdate = true;
    }
}
