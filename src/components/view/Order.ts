import { Form } from "../view/Form"; // Убедитесь, что путь к базовой форме верный
import { IOrderForm } from "../../types";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Order extends Form<IOrderForm> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._card = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cash = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

        // В клик листере только вызываем колбэк (через onInputChange), 
        // не меняя состояние кнопок напрямую здесь
        this._card.addEventListener('click', () => {
            this.onInputChange('payment', 'card');
        });

        this._cash.addEventListener('click', () => {
            this.onInputChange('payment', 'cash');
        });
    }

    // Сеттер теперь единственный источник правды для отображения активной кнопки.
    // Он будет вызван Презентером при рендере или при изменении модели.
    set payment(value: string) {
        // Используем toggleClass (если он есть в Component) или classList
        this._card.classList.toggle('button_alt-active', value === 'card');
        this._cash.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        const input = this.container.elements.namedItem('address') as HTMLInputElement;
        if (input) {
            input.value = value;
        }
    }
}