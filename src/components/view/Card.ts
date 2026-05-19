import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { categoryAndClass, CDN_URL } from "../../utils/constants"; 

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProduct {
    buttonText?: string;
    index?: number;
}

/**
 * Базовый класс карточки (Общий функционал)
 */
export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._category = container.querySelector(`.${blockName}__category`);
        this._image = container.querySelector(`.${blockName}__image`) as HTMLImageElement;
        this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    // Автоматическое добавление CDN_URL при установке пути к картинке
    set image(value: string) {
      if (this._image) {
    this.setImage(this._image, CDN_URL + value, this.title);
      }
  }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            // Сбрасываем старые классы категорий и выставляем новый по мапе
            this._category.className = `${this.blockName}__category`;
            const categoryClass = categoryAndClass[value];
            if (categoryClass) {
                this.toggleClass(this._category, categoryClass, true);
            }
        }
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) {
                this.setText(this._button, 'Недоступно');
                this.setDisabled(this._button, true);
            }
        } else {
            this.setText(this._price, `${value} синапсов`);
            if (this._button) {
                this.setDisabled(this._button, false);
            }
        }
    }
}

/**
 * 1. Карточка для Каталога (на главной странице)
 */
export class CardCatalog extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }
}

/**
 * 2. Карточка для Модального окна просмотра (Превью)
 */
export class CardPreview extends Card {
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._description = ensureElement<HTMLElement>(`.card__text`, container);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set buttonText(value: string) {
        if (this._button && this._button.textContent !== 'Недоступно') {
            this.setText(this._button, value);
        }
    }
}

/**
 * 3. Карточка для отображения внутри Корзины
 */
export class CardBasket extends Component<ICard> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.setText(this._index, String(value));
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