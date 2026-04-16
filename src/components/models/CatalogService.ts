import type { IOrder, ICatalogFromApi, IApi, IOrderResult } from "../../types";

export class CatalogService {
  private api: IApi;
  private readonly timeoutMs: number = 10000;

  constructor(api: IApi) {
    this.api = api;
  }

  async getCatalogProducts(): Promise<ICatalogFromApi> {
    try {
      const response = await this.api.get<ICatalogFromApi>("/product");
      return response;
    } catch (error) {
      console.error("Ошибка при загрузке каталога товаров:", error);
      throw new Error(
        "Не удалось загрузить каталог товаров. Проверьте подключение к интернету.",
      );
    }
  }

  async postOrder(value: IOrder): Promise<IOrderResult> {
    this.validateOrderData(value);

    try {
      const result = await this.api.post<IOrderResult>("/order", value);
      return result;
    } catch (error) {
      console.error("Ошибка при отправке заказа:", error);

      if (error instanceof Error) {
        // Сужаем тип до объекта с response
        const axiosError = error as { response?: { status?: number } };

        if (axiosError.response?.status === 400) {
          throw new Error(
            "Некорректные данные заказа. Проверьте заполнение всех полей.",
          );
        }
      }

      throw new Error("Произошла ошибка при оформлении заказа.");
    }
  }

  private validateOrderData(order: IOrder): void {
    if (!order.address || order.address.trim().length === 0) {
      throw new Error("Адрес доставки обязателен для заполнения");
    }
    if (order.payment === undefined || order.payment === null) {
      throw new Error("Необходимо выбрать способ оплаты");
    }
    if (order.items.length === 0) {
      throw new Error("Заказ должен содержать хотя бы один товар");
    }
    if (order.total <= 0) {
      throw new Error("Сумма заказа должна быть больше нуля");
    }
  }
}
