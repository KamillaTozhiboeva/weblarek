import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IHeader {
    counter: number;
}

export class AppHeader extends Component<IHeader> {
    protected _counter: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: any) {
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