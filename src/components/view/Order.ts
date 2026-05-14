import { Form } from "../view/Form";
import { IOrderForm } from "../../types";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Order extends Form<IOrderForm> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Ищем кнопки внутри контейнера формы
        this._card = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cash = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

        // Обработчики кликов на кнопки выбора оплаты
        // Внутри конструктора класса Order
this._card.addEventListener('click', () => {
    this.payment = 'card';
    // Явно генерируем событие изменения для валидации
    this.onInputChange('payment', 'card');
});

this._cash.addEventListener('click', () => {
    this.payment = 'cash';
    this.onInputChange('payment', 'cash');
});
    }

    // Сеттер для переключения активного класса кнопок
    set payment(value: string) {
        if (value === 'card') {
            this._card.classList.add('button_alt-active');
            this._cash.classList.remove('button_alt-active');
        } else {
            this._cash.classList.add('button_alt-active');
            this._card.classList.remove('button_alt-active');
        }
    }

    set address(value: string) {
        const input = this.container.elements.namedItem('address') as HTMLInputElement;
        if (input) {
            input.value = value;
        }
    }
}