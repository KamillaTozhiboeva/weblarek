import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IPage {
    catalog: HTMLElement[];
    locked: boolean;
}

export class CatalogPage extends Component<IPage> {
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._catalog = ensureElement<HTMLElement>('.gallery', container);
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}