import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  protected _catalogData: IProduct[] = [];
  protected _preview: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]) {
    this._catalogData = items;

    this.events.emit("items:changed", { items: this._catalogData });
  }

  get catalogData() {
    return this._catalogData;
  }

  setPreview(item: IProduct) {
    this._preview = item;
    this.events.emit("preview:changed", item);
  }

  get preview() {
    return this._preview;
  }
}
