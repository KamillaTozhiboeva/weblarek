import { IProduct } from "../../types";

export class Catalog {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  constructor() {}

  set catalogData(products: IProduct[]) {
    this._products = products;
  }

  get catalogData(): readonly IProduct[] {
    return this._products;
  }

  set selectedProductData(product: IProduct | null) {
    this._selectedProduct = product;
  }

  get selectedProductData(): IProduct | null {
    return this._selectedProduct;
  }

  findProductById(productId: string): IProduct | null {
    return this._products.find((p) => p.id === productId) || null;
  }

  clearCatalog(): void {
    this._products = [];
    this._selectedProduct = null;
  }
}
