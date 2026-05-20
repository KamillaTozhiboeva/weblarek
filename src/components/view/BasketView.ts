import { Component } from "../base/Component";
import { createElement, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IBasketView {
    items: HTMLElement[];
    totalPrice: number;
}

export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:open');
        });

        this.items = []; 
    }

    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false); 
        } else {
           
            const emptyNotice = document.createElement('p');
            emptyNotice.textContent = 'Корзина пуста';
            this._list.replaceChildren(emptyNotice);
            this.setDisabled(this._button, true);
        }
    }

  
    set totalPrice(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }
}