import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { CatalogService } from "./components/models/CatalogService";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

// Импортируем карточки из их собственных новых файлов
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CardBasket } from "./components/view/CardBasket";

// Импортируем новые бесконфликтные представления шапки и страницы каталога
import { AppHeader } from "./components/view/AppHeader";
import { CatalogPage } from "./components/view/CatalogPage";

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

// 3. Шаблоны элементов оформления
const templates = {
  cardCatalog: ensureElement<HTMLTemplateElement>("#card-catalog"),
  cardPreview: ensureElement<HTMLTemplateElement>("#card-preview"),
  cardBasket: ensureElement<HTMLTemplateElement>("#card-basket"),
  basket: ensureElement<HTMLTemplateElement>("#basket"),
  order: ensureElement<HTMLTemplateElement>("#order"),
  contacts: ensureElement<HTMLTemplateElement>("#contacts"),
  success: ensureElement<HTMLTemplateElement>("#success"),
};

// 4. Инициализация раздельных компонентов отображения (View)
const header = new AppHeader(ensureElement<HTMLElement>(".header"), events);
const page = new CatalogPage(document.body);
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);

const basketView = new BasketView(cloneTemplate(templates.basket), events);
const orderForm = new Order(cloneTemplate(templates.order), events);
const contactsForm = new Contacts(cloneTemplate(templates.contacts), events);

// ==========================================
// 5. Обработка событий (Логика Презентера)
// ==========================================

// Изменение списка товаров в каталоге
events.on("items:changed", () => {
  const cards = catalogModel.catalogData.map((item) => {
    // Передаем замыкание, чтобы View не знало про ID и внутренности модели
    const card = new CardCatalog(cloneTemplate(templates.cardCatalog), {
      onClick: () => events.emit("card:select", item),
    });
    return card.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
    });
  });
  page.catalog = cards;
});

// Клик по карточке товара на витрине
events.on("card:select", (item: IProduct) => {
  catalogModel.setPreview(item);
});

// Изменение открытого товара в модальном окне превью
events.on("preview:changed", (item: IProduct) => {
  const card = new CardPreview(cloneTemplate(templates.cardPreview), {
    onClick: () => events.emit("product:toBasket", item),
  });

  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      description: item.description,
      price: item.price,
      buttonText: basketModel.isInBasket(item.id)
        ? "Удалить из корзины"
        : "В корзину",
    }),
  });
});

// Добавление или удаление товара из корзины через превью
events.on("product:toBasket", (item: IProduct) => {
  if (basketModel.isInBasket(item.id)) {
    basketModel.removeFromBasket(item.id);
  } else {
    basketModel.addToBasket(item);
  }
  modal.close();
});

// Изменение состояния корзины (синхронизация счетчика хедера и списка)
events.on("basket:changed", () => {
  // Обновляем счетчик в независимом компоненте шапки
  header.counter = basketModel.items.length;

  const items = basketModel.items.map((item, index) => {
    const card = new CardBasket(cloneTemplate(templates.cardBasket), {
      onClick: () => basketModel.removeFromBasket(item.id),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basketView.render({
    items: items,
    totalPrice: basketModel.totalPrice,
  });
});

// Открытие модального окна корзины
events.on("basket:open", () => {
  modal.render({ content: basketView.render() });
});

// Валидация полей ввода форм покупателя
events.on(
  /^order\..*:change|^contacts\..*:change/,
  (data: { field: keyof IBuyer; value: string }) => {
    buyerModel.setOrderField(data.field, data.value);
  },
);

// Реакция на изменение ошибок валидации
events.on("formErrors:change", (errors: Partial<IBuyer>) => {
  const { payment, address, email, phone } = errors;

  orderForm.valid = !payment && !address;
  orderForm.errors = Object.values({ payment, address })
    .filter((i) => !!i)
    .join("; ");

  contactsForm.valid = !email && !phone;
  contactsForm.errors = Object.values({ email, phone })
    .filter((i) => !!i)
    .join("; ");
});

// Шаг 1: Открытие формы выбора способа оплаты и адреса
events.on("order:open", () => {
  modal.render({
    content: orderForm.render({
      address: "",
      payment: "card",
      valid: false,
      errors: [],
    }),
  });
});

// Шаг 2: Переход к форме ввода телефона и email
events.on("order:submit", () => {
  modal.render({
    content: contactsForm.render({
      email: "",
      phone: "",
      valid: false,
      errors: [],
    }),
  });
});

// Шаг 3: Отправка собранного заказа на сервер
events.on("contacts:submit", () => {
  const orderData = {
    ...buyerModel.buyerData,
    total: basketModel.totalPrice,
    items: basketModel.items.map((i) => i.id),
  };

  api
    .post<IOrderResult>("/order", orderData)
    .then((res) => {
      const success = new Success(cloneTemplate(templates.success), {
        onClick: () => modal.close(),
      });
      basketModel.clearBasket();
      buyerModel.clearBuyerData();

      modal.render({
        content: success.render({
          totalPrice: res.total,
        }),
      });
    })
    .catch((err) => {
      console.error("Ошибка при оформлении заказа:", err);
    });
});

// Блокировка и разблокировка прокрутки страницы при открытии модалок
events.on("modal:open", () => {
  page.locked = true;
});
events.on("modal:close", () => {
  page.locked = false;
});

// 6. Получение данных товаров с сервера при старте приложения
catalogService
  .getProducts()
  .then((products) => catalogModel.setItems(products))
  .catch((err) => console.error("Не удалось загрузить каталог товаров:", err));
