import "./scss/styles.scss";
import { Basket } from "./components/models/Basket";
import { Catalog } from "./components/models/Catalog";
import { Buyer } from "./components/models/Buyer";
import { CatalogService } from "./components/models/CatalogService";
import { API_URL } from "./utils/constants.ts";
import { Api } from "./components/base/Api.ts";

const api = new Api(API_URL);
const catalogService = new CatalogService(api);

const catalogModel = new Catalog();
const basketModel = new Basket();
const buyerModel = new Buyer();

console.log("Начинаем тестирование слоёв приложения...");

catalogService
  .getCatalogProducts()
  .then((items) => {
    console.log("Данные от API получены успешно");

    catalogModel.catalogData = items;
    console.log(
      "Модель каталога заполнена. Всего товаров:",
      catalogModel.catalogData.length,
    );

    if (items.length > 0) {
      const firstId = items[0].id;
      const found = catalogModel.findProductById(firstId);
      console.log(
        `Тест поиска товара по ID (${firstId}):`,
        found?.title === items[0].title ? "Пройден" : "Ошибка",
      );
    }

    console.log("\n--- Тестирование Корзины ---");
    const testProduct = items[0];

    basketModel.addItem(testProduct);
    console.log(
      "Товар добавлен в корзину. Количество уникальных позиций:",
      basketModel.itemCount,
    );
    console.log("Общая сумма:", basketModel.totalPrice);
    console.log("Товар в корзине?", basketModel.hasProduct(testProduct.id));

    basketModel.removeItem(testProduct.id);
    console.log("Товар удален. Сумма после удаления:", basketModel.totalPrice);

    console.log("\n--- Тестирование Валидации ---");

    buyerModel.buyerData = { address: "ул. Веб-разработки, 101" };
    console.log("Данные покупателя частично заполнены:", buyerModel.buyerData);

    const errors = buyerModel.validateForm();
    console.log("Ошибки валидации (ожидаем payment, email, phone):", errors);
    console.log("Форма валидна?", buyerModel.isValid());

    buyerModel.buyerData = {
      payment: "card",
      email: "dev@example.com",
      phone: "+79991234567",
    };
    console.log(
      "Форма после полного заполнения валидна?",
      buyerModel.isValid(),
    );

    console.log("\n Тестирование завершено успешно!");
  })
  .catch((err) => {
    console.error("Ошибка при тестировании:", err);
  });
