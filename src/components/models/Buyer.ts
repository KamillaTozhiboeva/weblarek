import { IBuyer } from "../../types";

export type IErrorsBuyer = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
  private _buyer: IBuyer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
  };

  get buyerData(): IBuyer {
    return this._buyer;
  }

  set buyerData(data: Partial<IBuyer>) {
    this._buyer = { ...this._buyer, ...data };
  }

  clearBuyerData(): void {
    this._buyer = { payment: null, address: "", email: "", phone: "" };
  }

  // Теперь метод проверяет только на наличие текста (не пустая строка)
  validateForm(): IErrorsBuyer {
    const errors: IErrorsBuyer = {};

    if (!this._buyer.address.trim()) errors.address = "Укажите адрес доставки";
    if (!this._buyer.payment) errors.payment = "Выберите способ оплаты";
    if (!this._buyer.email.trim()) errors.email = "Укажите email";
    if (!this._buyer.phone.trim()) errors.phone = "Укажите телефон";

    return errors;
  }
}
