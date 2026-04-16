import type { IProduct } from "../../types";

export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(initialProducts: IProduct[] = []) {
    this.products = initialProducts;
  }

  get catalogData(): readonly IProduct[] {
    return this.products;
  }

  set catalogData(products: IProduct[]) {
    if (!Array.isArray(products)) {
      throw new Error('catalogData должен быть массивом товаров');
    }
    this.products = [...products];
  }

  get selectedProductData(): IProduct | null {
    return this.selectedProduct;
  }

  set selectedProductData(product: IProduct | null) {
    if (product === null || this.isValidProduct(product)) {
      this.selectedProduct = product;
    } else {
      throw new Error('Некорректный объект товара');
    }
  }

  findProductById(productId: string): IProduct | null {
    return this.products.find(item => item.id === productId) ?? null;
  }

  addProduct(product: IProduct): void {
    if (!this.isValidProduct(product)) {
      throw new Error('Невозможно добавить некорректный товар');
    }
    this.products.push(product);
  }

  removeProductById(productId: string): boolean {
    const index = this.products.findIndex(item => item.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      if (this.selectedProduct?.id === productId) {
        this.selectedProduct = null;
      }
      return true;
    }
    return false;
  }

  updateProduct(updatedProduct: IProduct): boolean {
    const index = this.products.findIndex(item => item.id === updatedProduct.id);
    if (index !== -1) {
      if (!this.isValidProduct(updatedProduct)) {
        throw new Error('Невозможно обновить товар: некорректные данные');
      }
      this.products[index] = updatedProduct;
      if (this.selectedProduct?.id === updatedProduct.id) {
        this.selectedProduct = updatedProduct;
      }
      return true;
    }
    return false;
  }

  clearCatalog(): void {
    this.products = [];
    this.selectedProduct = null;
  }

  getProductCount(): number {
    return this.products.length;
  }

  hasProduct(productId: string): boolean {
    return this.products.some(item => item.id === productId);
  }

  private isValidProduct(product: IProduct): boolean {
    return !!product && typeof product.id === 'string' && product.id.trim().length > 0;
  }
}
