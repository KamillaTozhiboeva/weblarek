export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {}

  protected setText(element: HTMLElement, value: unknown) {
    if (element) {
      element.textContent = String(value);
    }
  }

  protected setDisabled(element: HTMLElement, state: boolean) {
    if (element) {
      if (state) element.setAttribute("disabled", "disabled");
      else element.removeAttribute("disabled");
    }
  }

  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (element) {
      element.src = src;
      if (alt) element.alt = alt;
    }
  }

  protected toggleClass(
    element: HTMLElement,
    className: string,
    force?: boolean,
  ) {
    element.classList.toggle(className, force);
  }

  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as any, data ?? {});
    return this.container;
  }
}
