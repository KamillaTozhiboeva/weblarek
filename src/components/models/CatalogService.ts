import { ICatalogFromApi, IOrder, IOrderResult } from "../../types";

export class CatalogService {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getCatalogProducts(): Promise<ICatalogFromApi> {
    return this._api.get<ICatalogFromApi>("/product");
  }

  async postOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>("/order", order);
  }
}

import { IApi } from "../base/api";