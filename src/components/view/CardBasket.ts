import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

interface ICardBasketActions {
    onClick: (event: MouseEvent) => void;
}

interface ICardBasket {
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected _index: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardBasketActions) {
        // Передаем БЭМ-префикс 'card', но элементы разметки ищем точечно
        super('card', container);

        this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
        this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.setText(this._index, String(value));
    }
}