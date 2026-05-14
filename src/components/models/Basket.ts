import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
    private _items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    get items(): readonly IProduct[] {
        return this._items;
    }

    get totalPrice(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    addItem(product: IProduct): void {
        // Требование: товары без цены покупать нельзя
        if (product.price === null) return;
        
        if (!this.hasProduct(product.id)) {
            this._items.push(product);
            this.events.emit('basket:changed');
        }
    }

    removeItem(productId: string): void {
        this._items = this._items.filter((item) => item.id !== productId);
        this.events.emit('basket:changed');
    }

    clearBasket(): void {
        this._items = [];
        this.events.emit('basket:changed');
    }

    hasProduct(productId: string): boolean {
        return this._items.some((item) => item.id === productId);
    }
}