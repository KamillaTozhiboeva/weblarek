export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// 1. Добавлен export для TPayment, чтобы тип был доступен в других модулях
export type TPayment = 'card' | 'cash';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export type IErrorsBuyer = Partial<Record<keyof IBuyer, string>>;

export interface ICatalogFromApi {
    total: number;
    items: IProduct[];
}

export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

export interface IOrderForm {
    payment: string;
    address: string;
}

export interface IOrderResult {
    id: string;
    total: number;
}