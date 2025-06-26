export interface HeapItem {
  prioridade: number;
  [key: string]: any;
}

export class MinHeap<T extends HeapItem> {
  private heap: T[] = [];

  private getParentIndex(index: number) { return Math.floor((index - 1) / 2); }
  private getLeftChildIndex(index: number) { return 2 * index + 1; }
  private getRightChildIndex(index: number) { return 2 * index + 2; }

  public size() { return this.heap.length; }
  public isEmpty() { return this.heap.length === 0; }

  public insert(item: T) {
    this.heap.push(item);
    this.heapifyUp();
  }

  public extractMin(): T | undefined {
    if (this.isEmpty()) return undefined;
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();
    return min;
  }

  public peek(): T | undefined {
    return this.heap[0];
  }

  private heapifyUp() {
    let index = this.heap.length - 1;
    while (
      index > 0 &&
      this.heap[this.getParentIndex(index)].prioridade > this.heap[index].prioridade
    ) {
      [this.heap[index], this.heap[this.getParentIndex(index)]] = [
        this.heap[this.getParentIndex(index)],
        this.heap[index],
      ];
      index = this.getParentIndex(index);
    }
  }

  private heapifyDown() {
    let index = 0;
    while (this.getLeftChildIndex(index) < this.heap.length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);
      if (
        rightChildIndex < this.heap.length &&
        this.heap[rightChildIndex].prioridade < this.heap[smallerChildIndex].prioridade
      ) {
        smallerChildIndex = rightChildIndex;
      }
      if (this.heap[index].prioridade <= this.heap[smallerChildIndex].prioridade) {
        break;
      }
      [this.heap[index], this.heap[smallerChildIndex]] = [
        this.heap[smallerChildIndex],
        this.heap[index],
      ];
      index = smallerChildIndex;
    }
  }
} 