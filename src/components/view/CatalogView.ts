import { Component } from "../base/Component";

interface ICatalog {
    items: HTMLElement[];
}

export class CatalogView extends Component<ICatalog> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}