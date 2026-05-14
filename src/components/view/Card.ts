import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

// Теперь description совпадает по типу с IProduct, Vite не будет ругаться
export interface ICard extends IProduct {
    buttonText?: string;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _description?: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
        this._description = container.querySelector('.card__text') as HTMLElement;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this.title);
        }
    }

    set price(value: number | null) {
        this.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
        if (this._button && value === null) {
            this.setDisabled(this._button, true);
            this.setText(this._button, 'Недоступно');
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
        }
    }

    set description(value: string) {
        if (this._description) {
            this.setText(this._description, value);
        }
    }
}