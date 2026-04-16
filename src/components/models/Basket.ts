import type { IProduct } from "../../types";

interface BasketItem {
  product: IProduct;
  quantity: number;
}

export class Basket {
  private items: BasketItem[] = [];
  private readonly maxQuantityPerItem: number = 99;

  //Геттер для товаров (возвращает копию массива)
  get products(): readonly BasketItem[] {
    return [...this.items];
  }

  // Добавление товара (увеличивает количество, если товар уже есть)
  addItemInBasket(product: IProduct, quantity: number = 1): void {
    if (quantity < 1) {
      throw new Error("Колличество должно быть положительным числом");
    }

    const existingItem = this.items.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > this.maxQuantityPerItem) {
        throw new Error(
          `Нельзя добавить больше {this.maxQuantityPerItem} единиц товара`,
        );
      }
      existingItem.quantity = newQuantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  // Обновление количества товара
  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      throw new Error("Количество должно быть положительным числом");
    }
    if (quantity > this.maxQuantityPerItem) {
      throw new Error(
        `Максимальное количество — ${this.maxQuantityPerItem} единиц`,
      );
    }

    const item = this.items.find((item) => item.product.id === productId);
    if (!item) {
      throw new Error("Товар не найден в корзине");
    }

    item.quantity = quantity;
  }

  // Удаление товара из корзины
  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
  }

  // Очистка корзины
  clear(): void {
    this.items = [];
  }

  // Подсчёт общего количества товаров (с учётом количества каждого)
  get totalQuantity(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Подсчёт общей стоимости (цена × количество для каждого товара)
  get totalPrice(): number {
    return this.items.reduce((total, item) => {
      const price = item.product.price ?? 0;
      return total + price * item.quantity;
    }, 0);
  }

  // Проверка, пуста ли корзина
  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Получение количества уникальных товаров (позиций)
  get itemCount(): number {
    return this.items.length;
  }

  // Проверка наличия товара в корзине
  hasProduct(productId: string): boolean {
    return this.items.some((item) => item.product.id === productId);
  }

  // Поиск товара по ID
  findItem(productId: string): BasketItem | undefined {
    return this.items.find((item) => item.product.id === productId);
  }
}
