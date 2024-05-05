import { InstancedBufferAttribute, DynamicDrawUsage, MeshBasicMaterial } from 'three';
import { addToSortedBuckets, removeFromSortedBuckets, updateSortedBucketsAllocation, resizeSortedBucketsSpace, } from '../allocation/sorted-buckets.js';
import { createPanelMaterial } from './panel-material.js';
import { InstancedPanelMesh } from './instanced-panel-mesh.js';
import { ElementType, setupRenderOrder } from '../order.js';
import { computed, effect } from '@preact/signals-core';
import { computedProperty } from '../properties/index.js';
export function computedPanelGroupDependencies(propertiesSignal) {
    const panelMaterialClass = computedProperty(propertiesSignal, 'panelMaterialClass', MeshBasicMaterial);
    const castShadow = computedProperty(propertiesSignal, 'castShadow', false);
    const receiveShadow = computedProperty(propertiesSignal, 'receiveShadow', false);
    return computed(() => ({
        panelMaterialClass: panelMaterialClass.value,
        castShadow: castShadow.value,
        receiveShadow: receiveShadow.value,
    }));
}
export const defaultPanelDependencies = {
    panelMaterialClass: MeshBasicMaterial,
    castShadow: false,
    receiveShadow: false,
};
export class PanelGroupManager {
    renderOrder;
    depthTest;
    pixelSize;
    root;
    object;
    map = new Map();
    constructor(renderOrder, depthTest, pixelSize, root, object, initializers) {
        this.renderOrder = renderOrder;
        this.depthTest = depthTest;
        this.pixelSize = pixelSize;
        this.root = root;
        this.object = object;
        initializers.push(() => {
            const onFrame = (delta) => this.traverse((group) => group.onFrame(delta));
            root.onFrameSet.add(onFrame);
            return () => root.onFrameSet.delete(onFrame);
        }, () => effect(() => {
            const ro = renderOrder.value;
            this.traverse((group) => group.setRenderOrder(ro));
        }), () => effect(() => {
            const dt = depthTest.value;
            this.traverse((group) => group.setDepthTest(dt));
        }));
    }
    traverse(fn) {
        for (const groups of this.map.values()) {
            for (const group of groups.values()) {
                fn(group);
            }
        }
    }
    getGroup(majorIndex, { panelMaterialClass, receiveShadow, castShadow } = defaultPanelDependencies) {
        let groups = this.map.get(panelMaterialClass);
        if (groups == null) {
            this.map.set(panelMaterialClass, (groups = new Map()));
        }
        const key = (majorIndex << 2) + ((receiveShadow ? 1 : 0) << 1) + (castShadow ? 1 : 0);
        let panelGroup = groups.get(key);
        if (panelGroup == null) {
            groups.set(key, (panelGroup = new InstancedPanelGroup(this.renderOrder.peek(), this.depthTest.peek(), this.object, panelMaterialClass, this.pixelSize, this.root, {
                elementType: ElementType.Panel,
                majorIndex,
                minorIndex: 0,
            }, receiveShadow, castShadow)));
        }
        return panelGroup;
    }
}
export class InstancedPanelGroup {
    renderOrder;
    object;
    pixelSize;
    root;
    orderInfo;
    meshReceiveShadow;
    meshCastShadow;
    mesh;
    instanceMatrix;
    instanceData;
    instanceClipping;
    instanceMaterial;
    buckets = [];
    elementCount = 0;
    bufferElementSize = 0;
    timeToNextUpdate;
    instanceDataOnUpdate;
    activateElement = (element, bucket, indexInBucket) => {
        const index = bucket.offset + indexInBucket;
        this.instanceData.set(element.materialConfig.defaultData, 16 * index);
        this.instanceData.addUpdateRange(16 * index, 16);
        this.instanceData.needsUpdate = true;
        element.activate(bucket, indexInBucket);
    };
    setElementIndex = (element, index) => {
        element.setIndexInBucket(index);
    };
    bufferCopyWithin = (targetIndex, startIndex, endIndex) => {
        copyWithinAttribute(this.instanceMatrix, targetIndex, startIndex, endIndex);
        copyWithinAttribute(this.instanceData, targetIndex, startIndex, endIndex);
        copyWithinAttribute(this.instanceClipping, targetIndex, startIndex, endIndex);
    };
    clearBufferAt = (index) => {
        //hiding the element by writing a 0 matrix (0 scale ...)
        const bufferOffset = index * 16;
        this.instanceMatrix.array.fill(0, bufferOffset, bufferOffset + 16);
        this.instanceMatrix.addUpdateRange(bufferOffset, 16);
        this.instanceMatrix.needsUpdate = true;
    };
    constructor(renderOrder, depthTest, object, materialClass, pixelSize, root, orderInfo, meshReceiveShadow, meshCastShadow) {
        this.renderOrder = renderOrder;
        this.object = object;
        this.pixelSize = pixelSize;
        this.root = root;
        this.orderInfo = orderInfo;
        this.meshReceiveShadow = meshReceiveShadow;
        this.meshCastShadow = meshCastShadow;
        this.instanceMaterial = createPanelMaterial(materialClass, { type: 'instanced' });
        this.instanceMaterial.depthTest = depthTest;
    }
    updateCount() {
        const lastBucket = this.buckets[this.buckets.length - 1];
        const count = lastBucket.offset + lastBucket.elements.length;
        if (this.mesh == null) {
            return;
        }
        this.mesh.count = count;
        this.mesh.visible = count > 0;
    }
    setDepthTest(depthTest) {
        this.instanceMaterial.depthTest = depthTest;
    }
    setRenderOrder(renderOrder) {
        this.renderOrder = renderOrder;
        if (this.mesh == null) {
            return;
        }
        this.mesh.renderOrder = renderOrder;
    }
    insert(bucketIndex, panel) {
        this.elementCount += 1;
        if (!addToSortedBuckets(this.buckets, bucketIndex, panel, this.activateElement)) {
            this.updateCount();
            return;
        }
        this.requestUpdate(0);
    }
    delete(bucketIndex, elementIndex, panel) {
        this.elementCount -= 1;
        if (!removeFromSortedBuckets(this.buckets, bucketIndex, panel, elementIndex, this.activateElement, this.clearBufferAt, this.setElementIndex, this.bufferCopyWithin)) {
            this.updateCount();
            return;
        }
        this.requestUpdate(1000); //request update in 1 second
    }
    onFrame(delta) {
        if (this.timeToNextUpdate == null) {
            return;
        }
        this.timeToNextUpdate -= delta;
        if (this.timeToNextUpdate > 0) {
            return;
        }
        this.update();
        this.timeToNextUpdate = undefined;
    }
    requestUpdate(time) {
        this.timeToNextUpdate = Math.min(this.timeToNextUpdate ?? Infinity, time);
    }
    update() {
        if (this.elementCount === 0) {
            if (this.mesh != null) {
                this.mesh.visible = false;
            }
            return;
        }
        //buffer is resized to have space for 150% of the actually needed elements
        if (this.elementCount > this.bufferElementSize) {
            //buffer is to small to host the current elements
            this.resize();
        }
        else if (this.elementCount <= this.bufferElementSize / 3) {
            //buffer is at least 300% bigger than the needed space
            this.resize();
        }
        updateSortedBucketsAllocation(this.buckets, this.activateElement, this.bufferCopyWithin);
        this.mesh.count = this.elementCount;
        this.mesh.visible = true;
    }
    resize() {
        const oldBufferSize = this.bufferElementSize;
        this.bufferElementSize = Math.ceil(this.elementCount * 1.5);
        if (this.mesh != null) {
            this.mesh.dispose();
            this.object.current?.remove(this.mesh);
        }
        resizeSortedBucketsSpace(this.buckets, oldBufferSize, this.bufferElementSize);
        const matrixArray = new Float32Array(this.bufferElementSize * 16);
        if (this.instanceMatrix != null) {
            matrixArray.set(this.instanceMatrix.array.subarray(0, matrixArray.length));
        }
        this.instanceMatrix = new InstancedBufferAttribute(matrixArray, 16, false);
        this.instanceMatrix.setUsage(DynamicDrawUsage);
        const dataArray = new Float32Array(this.bufferElementSize * 16);
        if (this.instanceData != null) {
            dataArray.set(this.instanceData.array.subarray(0, dataArray.length));
        }
        this.instanceData = new InstancedBufferAttribute(dataArray, 16, false);
        this.instanceDataOnUpdate = (start, count) => {
            this.instanceData.addUpdateRange(start, count);
            this.instanceData.needsUpdate = true;
        };
        this.instanceData.setUsage(DynamicDrawUsage);
        const clippingArray = new Float32Array(this.bufferElementSize * 16);
        if (this.instanceClipping != null) {
            clippingArray.set(this.instanceClipping.array.subarray(0, clippingArray.length));
        }
        this.instanceClipping = new InstancedBufferAttribute(clippingArray, 16, false);
        this.instanceClipping.setUsage(DynamicDrawUsage);
        this.mesh = new InstancedPanelMesh(this.instanceMatrix, this.instanceData, this.instanceClipping);
        this.mesh.renderOrder = this.renderOrder;
        setupRenderOrder(this.mesh, this.root, { value: this.orderInfo });
        this.mesh.material = this.instanceMaterial;
        this.mesh.receiveShadow = this.meshReceiveShadow;
        this.mesh.castShadow = this.meshCastShadow;
        this.object.current?.add(this.mesh);
    }
}
function copyWithinAttribute(attribute, targetIndex, startIndex, endIndex) {
    const itemSize = attribute.itemSize;
    const start = startIndex * itemSize;
    const end = endIndex * itemSize;
    const target = targetIndex * itemSize;
    attribute.array.copyWithin(target, start, end);
    const count = end - start;
    attribute.addUpdateRange(start, count);
    attribute.addUpdateRange(target, count);
    attribute.needsUpdate = true;
}
