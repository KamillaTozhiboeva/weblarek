import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected _counter: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._basket = ensureElement<HTMLElement>('.header__basket', container);

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }
}