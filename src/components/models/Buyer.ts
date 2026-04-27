import { IBuyer, TPayment } from "../../types";

// Тип для ошибок формы (ключ — поле, значение — текст ошибки)
export type IErrorsBuyer = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
    private _buyer: IBuyer = {
        payment: '',
        address: '',
        email: '',
        phone: ''
    };

    // Геттер и сеттер для данных покупателя
    get buyerData(): IBuyer {
        return this._buyer;
    }

    set buyerData(data: Partial<IBuyer>) {
        this._buyer = { ...this._buyer, ...data };
    }

    // Очистка данных
    clearBuyerData(): void {
        this._buyer = { payment: '', address: '', email: '', phone: '' };
    }

    // Валидация полей формы
    validateForm(): IErrorsBuyer {
        const errors: IErrorsBuyer = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;

        if (!this._buyer.address.trim()) errors.address = 'Укажите адрес доставки';
        if (!this._buyer.payment) errors.payment = 'Выберите способ оплаты';
        if (!emailRegex.test(this._buyer.email)) errors.email = 'Некорректный email';
        if (!phoneRegex.test(this._buyer.phone)) errors.phone = 'Некорректный формат телефона';

        return errors;
    }

    // Проверка на общую валидность
    isValid(): boolean {
        return Object.keys(this.validateForm()).length === 0;
    }
}