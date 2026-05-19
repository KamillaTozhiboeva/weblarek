import './scss/styles.scss';
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { CatalogService } from "./components/models/CatalogService";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

import { CardCatalog, CardPreview, CardBasket } from "./components/view/Card"; 
import { Page } from "./components/view/Page";
import { Modal } from "./components/view/Modal";
import { BasketView } from "./components/view/BasketView";
import { Order } from "./components/view/Order"; 
import { Contacts } from "./components/view/Contacts";
import { Success } from "./components/view/Success"; 

import { cloneTemplate, ensureElement } from "./utils/utils";
import { IProduct, IOrderResult, IBuyer } from "./types";

// 1. Инициализация базовых сервисов и шины событий
const events = new EventEmitter();
const api = new Api(API_URL);
const catalogService = new CatalogService(api);

// 2. Инициализация моделей данных
const catalogModel = new Catalog(events); 
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// 3. Шаблоны элементов (Предотвращает ошибки ReferenceError)
const templates = {
    cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
    cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    order: ensureElement<HTMLTemplateElement>('#order'),
    contacts: ensureElement<HTMLTemplateElement>('#contacts'),
    success: ensureElement<HTMLTemplateElement>('#success'),
};

// 4. Глобальные компоненты отображения
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);

const basketView = new BasketView(cloneTemplate(templates.basket), events);
const orderForm = new Order(cloneTemplate(templates.order), events);
const contactsForm = new Contacts(cloneTemplate(templates.contacts), events);

// ==========================================
// БИЗНЕС-ЛОГИКА И ОБРАБОТКА СОБЫТИЙ
// ==========================================

// Изменение списка товаров в каталоге (Отрисовка главной страницы)
events.on('items:changed', () => {
    const cards = catalogModel.catalogData.map(item => {
        const card = new CardCatalog(cloneTemplate(templates.cardCatalog), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image, // ИСПРАВЛЕНО: Передаем чистый относительный путь. Card.ts сам добавит CDN_URL
            price: item.price,
            category: item.category
        });
    });
    page.catalog = cards;
});

// Клик по карточке товара (Открытие превью)
events.on('card:select', (item: IProduct) => {
    catalogModel.setPreview(item);
});

// Изменение открытого товара в модальном окне просмотра
events.on('preview:changed', (item: IProduct) => {
    const card = new CardPreview(cloneTemplate(templates.cardPreview), {
        onClick: () => {
            events.emit('product:toBasket', item);
        }
    });

    modal.render({
        content: card.render({
            title: item.title,
            image: item.image, // ИСПРАВЛЕНО: Передаем чистый относительный путь. Card.ts сам добавит CDN_URL
            description: item.description,
            price: item.price,
            buttonText: basketModel.isInBasket(item.id) ? 'Удалить из корзины' : 'В корзину'
        })
    });
});

// Добавление / Удаление товара через модальное окно просмотра
events.on('product:toBasket', (item: IProduct) => {
    if (basketModel.isInBasket(item.id)) {
        basketModel.removeFromBasket(item.id);
    } else {
        basketModel.addToBasket(item);
    }
    modal.close();
});

// Изменение состояния корзины (Пересчет счетчика, сумм и обновление списка в DOM)
events.on('basket:changed', () => {
    // Обновляем счетчик на главной странице
    page.counter = basketModel.items.length;

    // Пересобираем элементы разметки для товаров внутри корзины
    const items = basketModel.items.map((item, index) => {
        const card = new CardBasket(cloneTemplate(templates.cardBasket), {
            onClick: () => {
                basketModel.removeFromBasket(item.id);
            }
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });

    // Рендерим обновленный вид корзины
    basketView.render({
        items: items,
        totalPrice: basketModel.totalPrice
    });
});

// Открытие модального окна корзины
events.on('basket:open', () => {
    modal.render({ content: basketView.render() });
});

// Валидация полей ввода покупателя
events.on(/^order\..*:change|^contacts\..*:change/, (data: { field: keyof IBuyer, value: string }) => {
    buyerModel.setOrderField(data.field, data.value);
});

// Реакция на изменение ошибок валидации форм
events.on('formErrors:change', (errors: Partial<IBuyer>) => {
    const { payment, address, email, phone } = errors;
    
    orderForm.valid = !payment && !address;
    orderForm.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
    
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Шаг 1 оформления: Открытие формы выбора способа оплаты и адреса
events.on('order:open', () => {
    modal.render({ content: orderForm.render({ address: '', payment: 'card', valid: false, errors: [] }) });
});

// Шаг 2 оформления: Переход к форме ввода телефона и email
events.on('order:submit', () => {
    modal.render({ content: contactsForm.render({ email: '', phone: '', valid: false, errors: [] }) });
});

// Шаг 3 оформления: Отправка собранного заказа на сервер
events.on('contacts:submit', () => {
    const orderData = { 
        ...buyerModel.buyerData, 
        total: basketModel.totalPrice, 
        items: basketModel.items.map(i => i.id) 
    };
    
    api.post<IOrderResult>('/order', orderData)
        .then((res) => {
            const success = new Success(cloneTemplate(templates.success), { 
                onClick: () => modal.close() 
            });
            basketModel.clearBasket();
            buyerModel.clearBuyerData();
            
            modal.render({
                content: success.render({
                    totalPrice: res.total
                })
            });
        })
        .catch((err) => {
            console.error('Ошибка при оформлении заказа:', err);
        });
});

// Блокировка / Разблокировка прокрутки страницы при открытии/закрытии модального окна
events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

// ==========================================
// ЗАПУСК ПРИЛОЖЕНИЯ (ЗАГРУЗКА ДАННЫХ)
// ==========================================
catalogService.getProducts()
    .then((products) => {
        catalogModel.setItems(products);
    })
    .catch((err) => {
        console.error('Не удалось загрузить каталог товаров:', err);
    });