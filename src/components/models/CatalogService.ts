import { IApi } from "../base/api";
import { IProduct, IOrder, IOrderResult } from "../../types";

export class CatalogService {
    constructor(private _api: IApi) {}

    async getCatalogProducts(): Promise<IProduct[]> {
        return this._api.get('/product')
            .then((data: { items: IProduct[] }) => data.items)
            .catch(err => {
                console.error(err);
                throw new Error('Не удалось загрузить каталог');
            });
    }

    async postOrder(order: IOrder): Promise<IOrderResult> {
        return this._api.post('/order', order)
            .then((data: IOrderResult) => data);
    }
}