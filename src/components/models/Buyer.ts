import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

// Определение типа ошибок (чтобы Vite/TS не ругались)
export type IErrorsBuyer = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
    private _buyer: IBuyer = {
        payment: 'card', 
        address: "",
        email: "",
        phone: "",
    };

    constructor(protected events: IEvents) {}

    get buyerData(): IBuyer {
        return this._buyer;
    }

    /**
     * Устанавливает значение поля и запускает валидацию
     */
    setOrderField(field: keyof IBuyer, value: string): void {
        // Приводим тип, так как мы уверены, что передаем строку из инпутов
        if (field === 'payment') {
            this._buyer.payment = value as 'card' | 'online'; // или те типы, что в IBuyer
        } else {
            this._buyer[field] = value;
        }

        const errors = this.validateForm();
        
        // Оповещаем об изменении ошибок для блокировки/разблокировки кнопок
        this.events.emit('formErrors:change', errors);

        // Оповещаем об изменении самих данных
        this.events.emit('buyer:change', this._buyer);
    }

    /**
     * Валидация всех полей формы
     */
    validateForm(): IErrorsBuyer {
        const errors: IErrorsBuyer = {};

        // Проверка адреса
        if (!this._buyer.address?.trim()) {
            errors.address = "Укажите адрес доставки";
        }

        // Проверка способа оплаты
        if (!this._buyer.payment) {
            errors.payment = "Выберите способ оплаты";
        }

        // Проверка email (базовая проверка на @)
        if (!this._buyer.email?.trim()) {
            errors.email = "Укажите email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._buyer.email)) {
            errors.email = "Некорректный формат email";
        }

        // Проверка телефона (базовая проверка на цифры)
        if (!this._buyer.phone?.trim()) {
            errors.phone = "Укажите номер телефона";
        } else if (!/^\+?[0-9]{10,12}$/.test(this._buyer.phone.replace(/[\s()-]/g, ''))) {
            errors.phone = "Некорректный формат телефона";
        }

        return errors;
    }

    /**
     * Очистка данных покупателя
     */
    clearBuyerData(): void {
        this._buyer = { 
            payment: 'card', 
            address: "", 
            email: "", 
            phone: "" 
        };
        this.events.emit('formErrors:change', {});
    }
}