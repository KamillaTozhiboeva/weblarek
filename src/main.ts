import './scss/styles.scss';
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { CatalogService } from "./components/models/CatalogService";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { Card } from "./components/view/Card";
import { Page } from "./components/view/Page";
import { Modal } from "./components/view/Modal";
import { BasketView } from "./components/view/BasketView";
import { Order } from "./components/view/Order"; 
import { Form } from "./components/view/Form";
import { Success } from "./components/view/Success"; 
import { cloneTemplate, ensureElement } from "./utils/utils";
import { IProduct, IBuyer, IOrder, IOrderResult } from "./types";

// Инициализация
const events = new EventEmitter();
const api = new Api(API_URL);
const catalogService = new CatalogService(api);

const catalogModel = new Catalog(events); 
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// Шаблоны
const templates = {
    catalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    preview: ensureElement<HTMLTemplateElement>('#card-preview'),
    basketItem: ensureElement<HTMLTemplateElement>('#card-basket'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts'),
    success: ensureElement<HTMLTemplateElement>('#success'),
};

// Визуальные компоненты
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new BasketView(cloneTemplate(templates.basket), events);
const orderForm = new Order(cloneTemplate(templates.order), events);
const contactsForm = new Form<IBuyer>(cloneTemplate(templates.contacts), events);

/**
 * КАТАЛОГ
 */
events.on('items:changed', () => {
    page.catalog = catalogModel.catalogData.map(item => {
        const card = new Card(cloneTemplate(templates.catalog), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: CDN_URL + item.image,
            price: item.price,
            category: item.category
        });
    });
});

events.on('card:select', (item: IProduct) => {
    const isAdded = basketModel.hasProduct(item.id);
    const card = new Card(cloneTemplate(templates.preview), {
        onClick: () => {
            if (isAdded) basketModel.removeItem(item.id);
            else basketModel.addItem(item);
            modal.close(); 
        }
    });
    modal.render({
        content: card.render({
            ...item,
            image: CDN_URL + item.image,
            buttonText: item.price === null ? 'Недоступно' : (isAdded ? 'Удалить из корзины' : 'Купить')
        })
    });
});

/**
 * КОРЗИНА
 */
events.on('basket:open', () => {
    modal.render({
        content: basketView.render({
            items: basketModel.items.map((item, index) => {
                const card = new Card(cloneTemplate(templates.basketItem), {
                    onClick: () => {
                        basketModel.removeItem(item.id);
                        events.emit('basket:open');
                    }
                });
                return card.render({ title: item.title, price: item.price, index: index + 1 });
            }),
            total: basketModel.totalPrice,
            selected: basketModel.items.length > 0 
        })
    });
});

events.on('basket:changed', () => {
    page.counter = basketModel.items.length;
});

/**
 * ОФОРМЛЕНИЕ ЗАКАЗА
 */

// Шаг 1: Выбор оплаты и адрес
events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            payment: buyerModel.buyerData.payment || '',
            address: buyerModel.buyerData.address || '',
            valid: false,
            errors: []
        })
    });
});

// Универсальный слушатель ввода
events.on(/^(order|contacts)\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    buyerModel.buyerData = { [data.field]: data.value };
});

// Валидация
events.on('formErrors:change', (errors: Partial<IBuyer>) => {
    const { payment, address, email, phone } = errors;
    
    orderForm.valid = !payment && !address;
    orderForm.errors = Object.values({payment, address}).filter(i => !!i).join('; ');

    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Шаг 2: Контакты
events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            email: buyerModel.buyerData.email || '',
            phone: buyerModel.buyerData.phone || '',
            valid: false,
            errors: []
        })
    });
});

// Финальная отправка (Здесь чаще всего возникала ошибка 500)
events.on('contacts:submit', () => {
    const currentBuyer = buyerModel.buyerData;
    
    // Формируем объект СТРОГО по требованиям API
    const orderData: IOrder = {
        payment: currentBuyer.payment,
        address: currentBuyer.address,
        email: currentBuyer.email,
        phone: currentBuyer.phone,
        total: basketModel.totalPrice,
        items: basketModel.items.map(item => item.id)
    };

    api.post<IOrderResult>('/order', orderData)
        .then((result) => {
            const success = new Success(cloneTemplate(templates.success), {
                onClick: () => {
                    modal.close();
                }
            });

            basketModel.clearBasket();
            buyerModel.clearBuyerData();
            page.counter = 0;

            modal.render({
                content: success.render({
                    total: result.total
                })
            });
        })
        .catch(err => {
            // Если сервер вернул 500, ошибка выведется здесь
            console.error('Ошибка при отправке заказа:', err);
        });
});

// Модальное окно
events.on('modal:open', () => { page.locked = true; });
events.on('modal:close', () => { page.locked = false; });

// Загрузка товаров
catalogService.getCatalogProducts()
    .then((data) => { catalogModel.catalogData = data.items; })
    .catch(err => console.error('Ошибка загрузки данных:', err));