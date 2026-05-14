import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

/**
 * Интерфейс, описывающий состояние страницы
 */
interface IPage {
    counter: number;   // Счётчик товаров в корзине
    catalog: HTMLElement[]; // Массив элементов карточек товаров
    locked: boolean;   // Блокировка прокрутки
}

/**
 * Компонент Page управляет основными элементами интерфейса:
 * счетчиком корзины, галереей товаров и оберткой страницы.
 */
export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов DOM
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        // Событие открытия корзины
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    /**
     * Обновляет числовое значение на иконке корзины
     */
    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    /**
     * Заполняет галерею переданными элементами (карточками)
     */
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    /**
     * Блокирует прокрутку страницы (нужно при открытии модального окна)
     */
    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}