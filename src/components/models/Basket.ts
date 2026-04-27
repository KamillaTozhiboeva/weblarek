import { IProduct } from "../../types";

export type BasketItem = IProduct & { quantity: number };

export class Basket {
    private _items: BasketItem[] = [];

    get items(): readonly BasketItem[] {
        return this._items;
    }

    get totalPrice(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    }

    get itemCount(): number {
        return this._items.length;
    }

    addItem(product: IProduct, quantity: number = 1): void {
        const existing = this._items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this._items.push({ ...product, quantity });
        }
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
    }

    clear(): void {
        this._items = [];
    }

    hasProduct(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }
}