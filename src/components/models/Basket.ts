import { IProduct } from "../../types";

export class Basket {
  private _items: IProduct[] = [];

  get items(): readonly IProduct[] {
    return this._items;
  }

  get totalPrice(): number {
    return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  get itemCount(): number {
    return this._items.length;
  }

  addItem(product: IProduct): void {
    this._items.push(product);
  }

  removeItem(productId: string): void {
    this._items = this._items.filter((item) => item.id !== productId);
  }

  clear(): void {
    this._items = [];
  }

  hasProduct(productId: string): boolean {
    return this._items.some((item) => item.id === productId);
  }
}
