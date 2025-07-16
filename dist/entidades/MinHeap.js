"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinHeap = void 0;
class MinHeap {
    constructor(compareFn) {
        this.heap = [];
        this.compare = compareFn;
    }
    size() {
        return this.heap.length;
    }
    peek() {
        return this.heap.length > 0 ? this.heap[0] : undefined;
    }
    insert(item) {
        this.heap.push(item);
        this.bubbleUp();
    }
    extractMin() {
        if (this.heap.length === 0) {
            return undefined;
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown();
        return min;
    }
    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
                this.swap(index, parentIndex);
                index = parentIndex;
            }
            else {
                break;
            }
        }
    }
    bubbleDown() {
        let index = 0;
        const n = this.heap.length;
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let smallestIndex = index;
            if (leftChildIndex < n && this.compare(this.heap[leftChildIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = leftChildIndex;
            }
            if (rightChildIndex < n && this.compare(this.heap[rightChildIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = rightChildIndex;
            }
            if (smallestIndex !== index) {
                this.swap(index, smallestIndex);
                index = smallestIndex;
            }
            else {
                break;
            }
        }
    }
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    getSortedElements() {
        return [...this.heap].sort(this.compare);
    }
}
exports.MinHeap = MinHeap;
