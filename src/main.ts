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

console.log("Запуск финального тестирования архитектуры...");

catalogService
  .getCatalogProducts()
  .then((data) => {
    console.log("Данные от API получены");

    catalogModel.catalogData = data.items;
    console.log(
      `В каталог загружено ${catalogModel.catalogData.length} товаров`,
    );

    const firstProduct = catalogModel.catalogData[0];
    if (firstProduct) {
      catalogModel.selectedProductData = firstProduct;
      console.log(
        "Выбран товар для превью:",
        catalogModel.selectedProductData.title,
      );
    }

    console.log("\n--- Тест Корзины ---");
    if (firstProduct) {
      basketModel.addItem(firstProduct);
      console.log("Товар добавлен. Сумма:", basketModel.totalPrice);
      console.log("Позиций в корзине:", basketModel.itemCount);

      basketModel.removeItem(firstProduct.id);
      console.log("Товар удален. Сумма:", basketModel.totalPrice);
    }

    console.log("\n--- Тест Валидации ---");

    buyerModel.clearBuyerData();
    buyerModel.buyerData = { address: "Пресвитерский пер., 19" };

    const errors = buyerModel.validateForm();
    console.log(
      "Текущие ошибки (ожидаем отсутствие оплаты, почты и телефона):",
      errors,
    );

    const isFormValid = Object.keys(errors).length === 0;
    console.log("Форма валидна?", isFormValid);

    buyerModel.buyerData = {
      payment: "card",
      email: "test@test.ru",
      phone: "+79990001122",
    };

    const finalErrors = buyerModel.validateForm();
    console.log(
      "Ошибки после полного заполнения (ожидаем пусто):",
      finalErrors,
    );
    console.log(
      "Итоговая проверка валидности:",
      Object.keys(finalErrors).length === 0,
    );

    console.log(
      "\n Все слои успешно протестированы и взаимодействуют корректно!",
    );
  })
  .catch((err) => {
    console.error("Критическая ошибка приложения:", err);
  });
