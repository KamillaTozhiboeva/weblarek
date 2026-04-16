import type { IBuyer, IErrorsBuyer } from "../../types";

// Строго типизированные пустые данные, соответствующие IBuyer
const emptyBuyerData = {
  payment: null,
  address: "",
  phone: "",
  email: "",
};
export class Buyer {
  private buyer: IBuyer;

  constructor() {
    this.buyer = { ...emptyBuyerData };
  }

  get buyerData(): IBuyer {
    return this.buyer;
  }

  set buyerData(buyer: Partial<IBuyer>) {
    // Обеспечиваем, что все обязательные поля присутствуют
    this.buyer = {
      ...this.buyer,
      ...buyer,
    };
  }

  clearBuyerData(): void {
    this.buyer = { ...emptyBuyerData };
  }

  validateForm(): IErrorsBuyer {
    const errors: IErrorsBuyer = {};

    // Валидация адреса
    if (!this.buyer.address.trim()) {
      errors.address = 'Поле "Адрес" не может быть пустым';
    }

    // Валидация телефона (простая проверка формата)
    if (!this.buyer.phone.trim()) {
      errors.phone = 'Поле "Телефон" не может быть пустым';
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(this.buyer.phone)) {
      errors.phone = "Введите корректный номер телефона";
    }

    // Валидация email
    if (!this.buyer.email.trim()) {
      errors.email = 'Поле "Эл. почта" не может быть пустым';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.buyer.email)) {
      errors.email = "Введите корректный адрес электронной почты";
    }

    // Валидация способа оплаты
    if (this.buyer.payment === null) {
      errors.payment = "Выберите способ оплаты";
    }

    return errors;
  }

  // Дополнительный метод: проверка, заполнены ли все данные без ошибок
  isValid(): boolean {
    return Object.keys(this.validateForm()).length === 0;
  }
}
