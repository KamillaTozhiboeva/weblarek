import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICard {
    title: string;
    price: number | null;
}

export class Card<T = {}> extends Component<ICard & T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement) {
        super(container);
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }
}