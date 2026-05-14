import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

export type IErrorsBuyer = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
    private _buyer: IBuyer = {
        payment: null,
        address: "",
        email: "",
        phone: "",
    };

    constructor(protected events: IEvents) {}

    get buyerData(): IBuyer {
        return this._buyer;
    }

    set buyerData(data: Partial<IBuyer>) {
        this._buyer = { ...this._buyer, ...data };
        this.validateForm();
    }

    clearBuyerData(): void {
        this._buyer = { payment: null, address: "", email: "", phone: "" };
        // Исправлено на :change (согласно чек-листу именования событий)
        this.events.emit('formErrors:change', {});
    }

    validateForm(): IErrorsBuyer {
        const errors: IErrorsBuyer = {};

        if (!this._buyer.address.trim()) errors.address = "Укажите адрес доставки";
        if (!this._buyer.payment) errors.payment = "Выберите способ оплаты";
        if (!this._buyer.email.trim()) errors.email = "Укажите email";
        if (!this._buyer.phone.trim()) errors.phone = "Укажите телефон";

        this.events.emit('formErrors:change', errors);
        return errors;
    }
}