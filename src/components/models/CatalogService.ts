import { IApi, ICatalogFromApi, IProduct } from "../../types";
import { CDN_URL } from "../../utils/constants"; 

export class CatalogService {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    return this._api
      .get<ICatalogFromApi>("/product")
      .then((data: ICatalogFromApi) =>
        data.items.map((item) => ({
          ...item,
          image: item.image, // Собираем полный путь к картинке
        })),
      );
  }
}
