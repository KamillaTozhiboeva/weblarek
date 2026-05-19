import { Form } from "./Form";
import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

/**
 * Компонент формы контактов (почта и телефон)
 */
export class Contacts extends Form<Partial<IBuyer>> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}