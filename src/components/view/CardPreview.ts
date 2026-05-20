import { CardCatalog } from "./CardCatalog";
import { ensureElement } from "../../utils/utils";

interface ICardPreviewActions {
    onClick: (event: MouseEvent) => void;
}

interface ICardPreview {
    description: string;
    buttonText: string;
}

export class CardPreview extends CardCatalog {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);

        this._description = ensureElement<HTMLElement>(`.card__text`, container);
        this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    // Переопределяем сеттер цены, чтобы управлять состоянием кнопки в превью
    set price(value: number | null) {
        super.price = value;
        if (value === null && this._button) {
            this.setText(this._button, 'Недоступно');
            this.setDisabled(this._button, true);
        } else if (this._button) {
            this.setDisabled(this._button, false);
        }
    }
}