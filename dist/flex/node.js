import { batch, effect, signal } from '@preact/signals-core';
import { Display, Edge, Overflow } from 'yoga-layout/load';
import { setter } from './setter.js';
import { setupImmediateProperties } from '../properties/immediate.js';
import { PointScaleFactor, createYogaNode } from './yoga.js';
function hasImmediateProperty(key) {
    if (key === 'measureFunc') {
        return true;
    }
    return key in setter;
}
export function createFlexNodeState() {
    const scrollable = signal([false, false]);
    return {
        size: signal(undefined),
        relativeCenter: signal(undefined),
        borderInset: signal(undefined),
        overflow: signal(Overflow.Visible),
        displayed: signal(false),
        scrollable,
        paddingInset: signal(undefined),
        maxScrollPosition: signal([undefined, undefined]),
    };
}
export class FlexNode {
    state;
    requestCalculateLayout;
    object;
    children = [];
    yogaNode;
    layoutChangeListeners = new Set();
    active = signal(false);
    constructor(state, propertiesSignal, requestCalculateLayout, object, subscriptions) {
        this.state = state;
        this.requestCalculateLayout = requestCalculateLayout;
        this.object = object;
        subscriptions.push(effect(() => {
            const yogaNode = createYogaNode();
            if (yogaNode == null) {
                return;
            }
            this.yogaNode = yogaNode;
            this.active.value = true;
            return () => {
                this.yogaNode?.getParent()?.removeChild(this.yogaNode);
                this.yogaNode?.free();
            };
        }));
        setupImmediateProperties(propertiesSignal, this.active, hasImmediateProperty, (key, value) => {
            setter[key](this.yogaNode, value);
            this.requestCalculateLayout();
        }, subscriptions);
    }
    setMeasureFunc(func) {
        if (!this.active.value) {
            return;
        }
        setMeasureFunc(this.yogaNode, func.value);
        this.requestCalculateLayout();
    }
    /**
     * use requestCalculateLayout instead
     */
    calculateLayout() {
        if (this.yogaNode == null) {
            return;
        }
        this.commit();
        this.yogaNode.calculateLayout(undefined, undefined);
        batch(() => this.updateMeasurements(true, undefined, undefined));
    }
    addChild(node) {
        this.children.push(node);
        this.requestCalculateLayout();
    }
    removeChild(node) {
        const i = this.children.indexOf(node);
        if (i === -1) {
            return;
        }
        this.children.splice(i, 1);
        this.requestCalculateLayout();
    }
    commit() {
        if (this.yogaNode == null) {
            throw new Error(`commit cannot be called without a yoga node`);
        }
        //commiting the children
        let groupChildren;
        this.children.sort((child1, child2) => {
            groupChildren ??= child1.object.current?.parent?.children;
            if (groupChildren == null) {
                return 0;
            }
            const group1 = child1.object.current;
            const group2 = child2.object.current;
            if (group1 == null || group2 == null) {
                return 0;
            }
            const i1 = groupChildren.indexOf(group1);
            if (i1 === -1) {
                throw new Error(`parent mismatch`);
            }
            const i2 = groupChildren.indexOf(group2);
            if (i2 === -1) {
                throw new Error(`parent mismatch`);
            }
            return i1 - i2;
        });
        let i = 0;
        let oldChildNode = this.yogaNode.getChild(i);
        let correctChild = this.children[i];
        while (correctChild != null || oldChildNode != null) {
            if (correctChild != null &&
                oldChildNode != null &&
                yogaNodeEqual(oldChildNode, assertNodeNotNull(correctChild.yogaNode))) {
                correctChild = this.children[++i];
                oldChildNode = this.yogaNode.getChild(i);
                continue;
            }
            //either remove, insert, or replace
            if (oldChildNode != null) {
                //either remove or replace
                this.yogaNode.removeChild(oldChildNode);
            }
            if (correctChild != null) {
                //either insert or replace
                const node = assertNodeNotNull(correctChild.yogaNode);
                node.getParent()?.removeChild(node);
                this.yogaNode.insertChild(node, i);
                correctChild = this.children[++i];
            }
            //the yoga node MUST be updated via getChild even for insert since the returned value is somehow bound to the index
            oldChildNode = this.yogaNode.getChild(i);
        }
        //recursively executing commit in children
        const childrenLength = this.children.length;
        for (let i = 0; i < childrenLength; i++) {
            this.children[i].commit();
        }
    }
    updateMeasurements(displayed, parentWidth, parentHeight) {
        if (this.yogaNode == null) {
            throw new Error(`update measurements cannot be called without a yoga node`);
        }
        this.state.overflow.value = this.yogaNode.getOverflow();
        displayed &&= this.yogaNode.getDisplay() === Display.Flex;
        this.state.displayed.value = displayed;
        const width = this.yogaNode.getComputedWidth();
        const height = this.yogaNode.getComputedHeight();
        updateVector2Signal(this.state.size, width, height);
        parentWidth ??= width;
        parentHeight ??= height;
        const x = this.yogaNode.getComputedLeft();
        const y = this.yogaNode.getComputedTop();
        const relativeCenterX = x + width * 0.5 - parentWidth * 0.5;
        const relativeCenterY = -(y + height * 0.5 - parentHeight * 0.5);
        updateVector2Signal(this.state.relativeCenter, relativeCenterX, relativeCenterY);
        const paddingTop = this.yogaNode.getComputedPadding(Edge.Top);
        const paddingLeft = this.yogaNode.getComputedPadding(Edge.Left);
        const paddingRight = this.yogaNode.getComputedPadding(Edge.Right);
        const paddingBottom = this.yogaNode.getComputedPadding(Edge.Bottom);
        updateInsetSignal(this.state.paddingInset, paddingTop, paddingRight, paddingBottom, paddingLeft);
        const borderTop = this.yogaNode.getComputedBorder(Edge.Top);
        const borderRight = this.yogaNode.getComputedBorder(Edge.Right);
        const borderBottom = this.yogaNode.getComputedBorder(Edge.Bottom);
        const borderLeft = this.yogaNode.getComputedBorder(Edge.Left);
        updateInsetSignal(this.state.borderInset, borderTop, borderRight, borderBottom, borderLeft);
        for (const layoutChangeListener of this.layoutChangeListeners) {
            layoutChangeListener();
        }
        const childrenLength = this.children.length;
        let maxContentWidth = 0;
        let maxContentHeight = 0;
        for (let i = 0; i < childrenLength; i++) {
            const [contentWidth, contentHeight] = this.children[i].updateMeasurements(displayed, width, height);
            maxContentWidth = Math.max(maxContentWidth, contentWidth);
            maxContentHeight = Math.max(maxContentHeight, contentHeight);
        }
        maxContentWidth -= borderLeft;
        maxContentHeight -= borderTop;
        if (this.state.overflow.value === Overflow.Scroll) {
            maxContentWidth += paddingRight;
            maxContentHeight += paddingLeft;
            const widthWithoutBorder = width - borderLeft - borderRight;
            const heightWithoutBorder = height - borderTop - borderBottom;
            const maxScrollX = maxContentWidth - widthWithoutBorder;
            const maxScrollY = maxContentHeight - heightWithoutBorder;
            const xScrollable = maxScrollX > 0.5;
            const yScrollable = maxScrollY > 0.5;
            updateVector2Signal(this.state.maxScrollPosition, xScrollable ? maxScrollX : undefined, yScrollable ? maxScrollY : undefined);
            updateVector2Signal(this.state.scrollable, xScrollable, yScrollable);
        }
        else {
            updateVector2Signal(this.state.maxScrollPosition, undefined, undefined);
            updateVector2Signal(this.state.scrollable, false, false);
        }
        const overflowVisible = this.state.overflow.value === Overflow.Visible;
        return [
            x + Math.max(width, overflowVisible ? maxContentWidth : 0),
            y + Math.max(height, overflowVisible ? maxContentHeight : 0),
        ];
    }
    addLayoutChangeListener(listener) {
        this.layoutChangeListeners.add(listener);
        return () => void this.layoutChangeListeners.delete(listener);
    }
}
export function setMeasureFunc(node, func) {
    if (func == null) {
        node.setMeasureFunc(null);
        return;
    }
    node.setMeasureFunc((width, wMode, height, hMode) => {
        const result = func(width, wMode, height, hMode);
        return {
            width: Math.ceil(result.width * PointScaleFactor + 1) / PointScaleFactor,
            height: Math.ceil(result.height * PointScaleFactor + 1) / PointScaleFactor,
        };
    });
    node.markDirty();
}
function updateVector2Signal(signal, x, y) {
    if (signal.value != null) {
        const [oldX, oldY] = signal.value;
        if (oldX === x && oldY === y) {
            return;
        }
    }
    signal.value = [x, y];
}
function updateInsetSignal(signal, top, right, bottom, left) {
    if (signal.value != null) {
        const [oldTop, oldRight, oldBottom, oldLeft] = signal.value;
        if (oldTop == top && oldRight == right && oldBottom == bottom && oldLeft == left) {
            return;
        }
    }
    signal.value = [top, right, bottom, left];
}
function assertNodeNotNull(val) {
    if (val == null) {
        throw new Error(`commit cannot be called with a children that miss a yoga node`);
    }
    return val;
}
function yogaNodeEqual(n1, n2) {
    return n1['M']['O'] === n2['M']['O'];
}
