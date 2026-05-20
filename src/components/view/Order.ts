import { Form } from "../view/Form";
import { IBuyer } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Order extends Form<IBuyer> {
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: any) {
    super(container, events);

    this._cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      container,
    );
    this._cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      container,
    );

    this._cardButton.addEventListener("click", () => {
      this.payment = "card";
      this.onInputChange("payment", "card");
    });

    this._cashButton.addEventListener("click", () => {
      this.payment = "cash";
      this.onInputChange("payment", "cash");
    });
  }

  set payment(value: string) {
    if (value === "card") {
      this._cardButton.classList.add("button_alt-active");
      this._cashButton.classList.remove("button_alt-active");
    } else {
      this._cashButton.classList.add("button_alt-active");
      this._cardButton.classList.remove("button_alt-active");
    }
  }

  set address(value: string) {
    (this.container.elements.namedItem("address") as HTMLInputElement).value =
      value;
  }
}
