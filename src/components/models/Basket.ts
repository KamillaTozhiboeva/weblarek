import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
    protected _items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    // ЭТОТ МЕТОД ИСПРАВИТ ОШИБКУ
    // Проверяет наличие товара в корзине по его id
    isInBasket(id: string): boolean {
        return this._items.some(item => item.id === id);
    }

    // Добавление товара
    addToBasket(item: IProduct) {
        this._items.push(item);
        this.events.emit('basket:changed');
    }

    // Удаление товара
    removeFromBasket(id: string) {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('basket:changed');
    }

    // Очистка корзины
    clearBasket() {
        this._items = [];
        this.events.emit('basket:changed');
    }

    get items() {
        return this._items;
    }

    // Сумма всех товаров
    get totalPrice() {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }
}