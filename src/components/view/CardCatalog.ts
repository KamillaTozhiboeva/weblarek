import { Card } from "./Card";
import { categoryAndClass, CDN_URL } from "../../utils/constants";

interface ICardCatalogActions {
    onClick: (event: MouseEvent) => void;
}

interface ICardCatalog {
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalog> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardCatalogActions) {
        super('card', container);

        this._category = container.querySelector(`.card__category`) as HTMLElement;
        this._image = container.querySelector(`.card__image`) as HTMLImageElement;

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            this._category.className = 'card__category';
            const categoryClass = categoryAndClass[value];
            if (categoryClass) {
                this.toggleClass(this._category, categoryClass, true);
            }
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, CDN_URL + value, this.title);
        }
    }
}