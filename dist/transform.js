import { computed, effect } from '@preact/signals-core';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { alignmentXMap, alignmentYMap } from './utils.js';
import { computedProperty } from './properties/index.js';
const tHelper = new Vector3();
const sHelper = new Vector3();
const originVector = new Vector3();
const matrixHelper = new Matrix4();
const eulerHelper = new Euler();
const quaternionHelper = new Quaternion();
const toRad = Math.PI / 180;
function toQuaternion([x, y, z]) {
    return quaternionHelper.setFromEuler(eulerHelper.set(x * toRad, y * toRad, z * toRad));
}
const defaultTransformOriginX = 'center';
const defaultTransformOriginY = 'center';
export function computedTransformMatrix(propertiesSignal, { relativeCenter, size }, pixelSizeSignal) {
    //B * O^-1 * T * O
    //B = bound transformation matrix
    //O = matrix to transform the origin for matrix T
    //T = transform matrix (translate, rotate, scale)
    const tTX = computedProperty(propertiesSignal, 'transformTranslateX', 0);
    const tTY = computedProperty(propertiesSignal, 'transformTranslateY', 0);
    const tTZ = computedProperty(propertiesSignal, 'transformTranslateZ', 0);
    const tRX = computedProperty(propertiesSignal, 'transformRotateX', 0);
    const tRY = computedProperty(propertiesSignal, 'transformRotateY', 0);
    const tRZ = computedProperty(propertiesSignal, 'transformRotateZ', 0);
    const tSX = computedProperty(propertiesSignal, 'transformScaleX', 1);
    const tSY = computedProperty(propertiesSignal, 'transformScaleY', 1);
    const tSZ = computedProperty(propertiesSignal, 'transformScaleZ', 1);
    const tOX = computedProperty(propertiesSignal, 'transformOriginX', defaultTransformOriginX);
    const tOY = computedProperty(propertiesSignal, 'transformOriginY', defaultTransformOriginY);
    return computed(() => {
        if (relativeCenter.value == null) {
            return undefined;
        }
        const [x, y] = relativeCenter.value;
        const pixelSize = pixelSizeSignal.value;
        const result = new Matrix4().makeTranslation(x * pixelSize, y * pixelSize, 0);
        let originCenter = true;
        if (tOX.value != 'center' || tOY.value != 'center') {
            if (size.value == null) {
                return undefined;
            }
            const [width, height] = size.value;
            originCenter = false;
            originVector.set(-alignmentXMap[tOX.value] * width * pixelSize, -alignmentYMap[tOY.value] * height * pixelSize, 0);
            result.multiply(matrixHelper.makeTranslation(originVector));
            originVector.negate();
        }
        const r = [tRX.value, tRY.value, tRZ.value];
        const t = [tTX.value, -tTY.value, tTZ.value];
        const s = [tSX.value, tSY.value, tSZ.value];
        if (t.some((v) => v != 0) || r.some((v) => v != 0) || s.some((v) => v != 1)) {
            result.multiply(matrixHelper.compose(tHelper.fromArray(t).multiplyScalar(pixelSize), toQuaternion(r), sHelper.fromArray(s)));
        }
        if (!originCenter) {
            result.multiply(matrixHelper.makeTranslation(originVector));
        }
        return result;
    });
}
export function applyTransform(object, transformMatrix, initializers) {
    initializers.push(() => effect(() => {
        if (transformMatrix.value == null) {
            object.current?.matrix.elements.fill(0);
            return;
        }
        object.current?.matrix.copy(transformMatrix.value);
    }));
}
