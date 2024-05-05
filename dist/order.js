import { computed } from '@preact/signals-core';
import { computedProperty } from './properties/index.js';
import { readReactive } from './utils.js';
export const cameraDistanceKey = Symbol('camera-distance-key');
export const orderInfoKey = Symbol('order-info-key');
export function reversePainterSortStable(a, b) {
    if (a.groupOrder !== b.groupOrder) {
        return a.groupOrder - b.groupOrder;
    }
    if (a.renderOrder !== b.renderOrder) {
        return a.renderOrder - b.renderOrder;
    }
    const aDistanceRef = a.object[cameraDistanceKey];
    const bDistanceRef = b.object[cameraDistanceKey];
    if (aDistanceRef == null || bDistanceRef == null) {
        //default z comparison
        return a.z !== b.z ? b.z - a.z : a.id - b.id;
    }
    if (aDistanceRef === bDistanceRef) {
        return compareOrderInfo(a.object[orderInfoKey].value, b.object[orderInfoKey].value);
    }
    return bDistanceRef.cameraDistance - aDistanceRef.cameraDistance;
}
//the following order tries to represent the most common element order of the respective element types (e.g. panels are most likely the background element)
export const ElementType = {
    Panel: 0, //render first
    Image: 1,
    Object: 2,
    Custom: 3,
    Svg: 4,
    Text: 5, //render last
};
function compareOrderInfo(o1, o2) {
    if (o1 == null || o2 == null) {
        return 0;
    }
    let dif = o1.majorIndex - o2.majorIndex;
    if (dif != 0) {
        return dif;
    }
    dif = o1.elementType - o2.elementType;
    if (dif != 0) {
        return dif;
    }
    return o1.minorIndex - o2.minorIndex;
}
export function computedOrderInfo(propertiesSignal, type, instancedGroupDependencies, parentOrderInfoSignal) {
    const zIndexOffset = propertiesSignal == null
        ? undefined
        : computedProperty(propertiesSignal, 'zIndexOffset', undefined);
    return computed(() => {
        let parentOrderInfo;
        if (parentOrderInfoSignal == null) {
            parentOrderInfo = undefined;
        }
        else if (parentOrderInfoSignal.value == null) {
            return undefined;
        }
        else {
            parentOrderInfo = parentOrderInfoSignal.value;
        }
        const offset = zIndexOffset?.value;
        const majorOffset = typeof offset === 'number' ? offset : offset?.major ?? 0;
        const minorOffset = typeof offset === 'number' ? 0 : offset?.minor ?? 0;
        let majorIndex;
        let minorIndex;
        if (parentOrderInfo == null) {
            majorIndex = 0;
            minorIndex = 0;
        }
        else if (type > parentOrderInfo.elementType) {
            majorIndex = parentOrderInfo.majorIndex;
            minorIndex = 0;
        }
        else if (type != parentOrderInfo.elementType ||
            !shallowEqualRecord(readReactive(instancedGroupDependencies), readReactive(parentOrderInfo.instancedGroupDependencies))) {
            majorIndex = parentOrderInfo.majorIndex + 1;
            minorIndex = 0;
        }
        else {
            majorIndex = parentOrderInfo.majorIndex;
            minorIndex = parentOrderInfo.minorIndex + 1;
        }
        if (majorOffset > 0) {
            majorIndex += majorOffset;
            minorIndex = 0;
        }
        minorIndex += minorOffset;
        return {
            instancedGroupDependencies,
            elementType: type,
            majorIndex,
            minorIndex,
        };
    });
}
function shallowEqualRecord(r1, r2) {
    if (r1 === r2) {
        return true;
    }
    if (r1 == null || r2 == null) {
        return false;
    }
    //i counts the number of keys in r1
    let i = 0;
    for (const key in r1) {
        if (r1[key] != r2[key]) {
            return false;
        }
        ++i;
    }
    return i === Object.keys(r2).length;
}
export function setupRenderOrder(result, rootCameraDistance, orderInfo) {
    ;
    result[cameraDistanceKey] = rootCameraDistance;
    result[orderInfoKey] = orderInfo;
    return result;
}
