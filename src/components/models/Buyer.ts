import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export type IErrorsBuyer = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
  private _buyer: IBuyer = {
    payment: "card",
    address: "",
    email: "",
    phone: "",
  };

  constructor(protected events: IEvents) {}

  get buyerData(): IBuyer {
    return this._buyer;
  }

  setOrderField(field: keyof IBuyer, value: string): void {
    if (field === "payment") {
      this._buyer.payment = value as "card" | "cash";
    } else {
      this._buyer[field] = value;
    }

    const errors = this.validateForm();

    this.events.emit("formErrors:change", errors);

    this.events.emit("buyer:change", this._buyer);
  }

  validateForm(): IErrorsBuyer {
    const errors: IErrorsBuyer = {};

    if (!this._buyer.address.trim()) errors.address = "Укажите адрес доставки";
    if (!this._buyer.payment) errors.payment = "Выберите способ оплаты";
    if (!this._buyer.email.trim()) errors.email = "Укажите email";
    if (!this._buyer.phone.trim()) errors.phone = "Укажите телефон";

    this.events.emit("formErrors:change", errors);
    return errors;
  }

  clearBuyerData(): void {
    this._buyer = {
      payment: "card",
      address: "",
      email: "",
      phone: "",
    };
    this.events.emit("formErrors:change", {});
  }
}
