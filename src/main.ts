import "./scss/styles.scss";
import { Basket } from "./components/models/Basket";
import { Catalog } from "./components/models/Catalog";
import { Buyer } from "./components/models/Buyer";
import { CatalogService } from "./components/models/CatalogService";
import { apiProducts } from "./utils/data.ts";
import type { IBuyer } from "./types";
import { API_URL } from "./utils/constants.ts";
import { Api } from "./components/base/Api.ts";

//Проверяем каталог
const catalog = new Catalog();

console.log("=== Тестирование класса Catalog ===");

// Тест 1: Проверка начального состояния
console.log("\n--- Тест 1: Начальное состояние каталога ---");
console.log("Массив товаров из каталога:", catalog.catalogData);
console.log("Выбранный товар:", catalog.selectedProductData);

// Тест 2: Заполнение каталога товарами из apiProducts
console.log("\n--- Тест 2: Заполнение каталога товарами из API ---");
catalog.catalogData = apiProducts.items;
console.log("Массив товаров из каталога:", catalog.catalogData);
console.log("Количество товаров в каталоге:", catalog.catalogData.length);

// Тест 3: Выбор товара и проверка выбранного товара
console.log("\n--- Тест 3: Выбор и проверка выбранного товара ---");
if (catalog.catalogData.length > 0) {
  catalog.selectedProductData = catalog.catalogData[0];
  console.log("Выбранный товар:", catalog.selectedProductData);
} else {
  console.warn("Пропущен тест 3: в каталоге нет товаров для выбора");
}

// Тест 4: Поиск товара по ID
console.log("\n--- Тест 4: Поиск товара по ID ---");
if (catalog.catalogData.length > 0) {
  const firstProductId = catalog.catalogData[0].id;
  const foundProduct = catalog.findProductById(firstProductId);
  console.log(`Товар с ID "${firstProductId}":`, foundProduct);

  // Проверяем поиск несуществующего товара
  const nonExistentId = "non-existent-id";
  const notFoundProduct = catalog.findProductById(nonExistentId);
  console.log(`Товар с несуществующим ID "${nonExistentId}":`, notFoundProduct);
} else {
  console.warn("Пропущен тест 4: в каталоге нет товаров для поиска");
}

// Тест 5: Проверка граничных случаев
console.log("\n--- Тест 5: Проверка граничных случаев ---");

// Очищаем каталог
catalog.catalogData = [];
console.log("Каталог после очистки:", catalog.catalogData);
console.log("Количество товаров после очистки:", catalog.catalogData.length);

// Пытаемся выбрать товар из пустого каталога
try {
  if (catalog.catalogData.length === 0) {
    console.log("Попытка выбрать товар из пустого каталога...");
    // Поскольку в пустом каталоге нет товаров, не пытаемся установить selectedProductData
    console.log("selectedProductData остаётся:", catalog.selectedProductData);
  }
} catch (error) {
  if (error instanceof Error) {
    console.error("Ошибка при работе с пустым каталогом:", error.message);
  } else {
    console.error("Неожиданная ошибка:", error);
  }
}

// Проверяем поиск в пустом каталоге
const searchInEmpty = catalog.findProductById("any-id");
console.log("Поиск товара в пустом каталоге:", searchInEmpty);

// Тест 6: Повторное заполнение и проверка
console.log("\n--- Тест 6: Повторное заполнение каталога ---");
if (apiProducts.items && apiProducts.items.length > 0) {
  catalog.catalogData = apiProducts.items;
  console.log(
    "Каталог повторно заполнен. Количество товаров:",
    catalog.catalogData.length,
  );

  if (catalog.catalogData.length > 1) {
    catalog.selectedProductData = catalog.catalogData[1];
    console.log("Новый выбранный товар:", catalog.selectedProductData);
  }
} else {
  console.warn("Пропущен тест 6: нет данных для повторного заполнения");
}

// Финальная проверка состояния каталога
console.log("\n=== Финальная проверка класса Catalog ===");
console.log(
  "Текущее количество товаров в каталоге:",
  catalog.catalogData.length,
);
console.log("Текущий выбранный товар:", catalog.selectedProductData);
if (catalog.catalogData.length > 0) {
  const randomProduct =
    catalog.catalogData[Math.floor(Math.random() * catalog.catalogData.length)];
  console.log("Пример товара из каталога:", randomProduct);
}

//Проверяем корзину

const basket = new Basket();

console.log("=== Тестирование корзины с Api-данными ===");

// Проверяем, что apiProducts содержит товары
if (
  !apiProducts?.items ||
  !Array.isArray(apiProducts.items) ||
  apiProducts.items.length === 0
) {
  console.error("Ошибка: apiProducts не содержит данных о товарах");
} else {
  console.log(`Загружено ${apiProducts.items.length} товаров из API`);
}

// Тест 1: Добавление товаров из apiProducts
console.log("\n--- Тест 1: Добавление товаров из API в корзину ---");
if (apiProducts.items.length > 0) {
  basket.addItemInBasket(apiProducts.items[0], 2); // Добавляем 2 единицы первого товара
  if (apiProducts.items.length > 1) {
    basket.addItemInBasket(apiProducts.items[1], 1); // Добавляем 1 единицу второго товара
  }
  console.log("Корзина после добавления товаров:", basket.products);
  console.log("Общее количество товаров:", basket.totalQuantity);
  console.log("Общая стоимость:", basket.totalPrice);
  console.log("Количество уникальных позиций:", basket.itemCount);
} else {
  console.warn("Пропущен тест 1: нет товаров в apiProducts");
}

// Тест 2: Добавление существующего товара (увеличение количества)
console.log("\n--- Тест 2: Добавление существующего товара ---");
if (basket.itemCount > 0 && apiProducts.items.length > 0) {
  basket.addItemInBasket(apiProducts.items[0], 3); // Добавляем ещё 3 единицы первого товара
  console.log(
    "Корзина после добавления существующего товара:",
    basket.products,
  );
  console.log("Общее количество товаров:", basket.totalQuantity);
  console.log("Общая стоимость:", basket.totalPrice);
} else {
  console.warn("Пропущен тест 2: нет товаров для добавления");
}

// Тест 3: Обновление количества
if (basket.itemCount > 0 && apiProducts.items.length > 1) {
  try {
    basket.updateQuantity(apiProducts.items[1].id, 3); // Меняем количество второго товара на 3
    console.log("Корзина после обновления количества:", basket.products);
    console.log("Общее количество товаров:", basket.totalQuantity);
    console.log("Общая стоимость:", basket.totalPrice);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка при обновлении количества:", error.message);
    } else {
      // Обрабатываем случай, когда ошибка не является экземпляром Error
      console.error("Неожиданная ошибка при обновлении количества:", error);
    }
  }
} else {
  console.warn("Пропущен тест 3: нет товаров для обновления");
}


// Тест 4: Проверка наличия товара
console.log("\n--- Тест 4: Проверка наличия товаров ---");
if (apiProducts.items.length > 0) {
  const firstProductId = apiProducts.items[0].id;
  const thirdProductId =
    apiProducts.items.length > 2 ? apiProducts.items[2].id : "unknown";
  console.log(
    `Товар ${firstProductId} в корзине:`,
    basket.hasProduct(firstProductId),
  );
  console.log(
    `Товар ${thirdProductId} в корзине:`,
    basket.hasProduct(thirdProductId),
  );
} else {
  console.warn("Пропущен тест 4: нет товаров для проверки");
}

// Тест 5: Поиск товара по ID
console.log("\n--- Тест 5: Поиск товара по ID ---");
if (apiProducts.items.length > 0) {
  const foundItem = basket.findItem(apiProducts.items[0].id);
  console.log("Найденный товар:", foundItem);
} else {
  console.warn("Пропущен тест 5: нет товаров для поиска");
}

// Тест 6: Удаление товара
console.log("\n--- Тест 6: Удаление товара из корзины ---");
if (basket.itemCount > 0 && apiProducts.items.length > 1) {
  basket.removeItem(apiProducts.items[1].id); // Удаляем второй товар
  console.log("Корзина после удаления товара:", basket.products);
  console.log("Общее количество товаров:", basket.totalQuantity);
  console.log("Общая стоимость:", basket.totalPrice);
  console.log(
    `Товар ${apiProducts.items[1].id} в корзине:`,
    basket.hasProduct(apiProducts.items[1].id),
  );
} else {
  console.warn("Пропущен тест 6: нет товаров для удаления");
}

// Тест 7: Очистка корзины
console.log("\n--- Тест 7: Очистка корзины ---");
basket.clear();
console.log("Корзина после очистки:", basket.products);
console.log("Пуста ли корзина:", basket.isEmpty);
console.log("Общее количество товаров:", basket.totalQuantity);
console.log("Общая стоимость:", basket.totalPrice);

// Тест 8: Проверка граничных условий и ошибок
console.log("\n--- Тест 8: Проверка ошибок и граничных условий ---");

// Проверка ошибки при отрицательном количестве
try {
  if (apiProducts.items.length > 0) {
    basket.addItemInBasket(apiProducts.items[0], -1);
  }
} catch (error) {
  if (error instanceof Error) {
    console.log(
      "Ошибка при добавлении с отрицательным количеством:",
      error.message
    );
  } else {
    console.log(
      "Неожиданная ошибка при добавлении товара:",
      error
    );
  }
}

// Проверка ошибки при превышении максимального количества
try {
  if (apiProducts.items.length > 0) {
    const maxTestProduct = apiProducts.items[0];
    basket.addItemInBasket(maxTestProduct, 99); // Добавляем максимально допустимое количество
    console.log("Добавление максимального количества (99): успешно");

    try {
      basket.addItemInBasket(maxTestProduct, 2); // Попытка превысить лимит
    } catch (innerError) {
      if (innerError instanceof Error) {
        console.log(
          "Ошибка при превышении максимального количества:",
          innerError.message
        );
      } else {
        console.log(
          "Неожиданная ошибка при превышении максимального количества (не Error):",
          innerError
        );
      }
    }
  }
} catch (outerError) {
  if (outerError instanceof Error) {
    console.log("Ошибка в тесте максимального количества:", outerError.message);
  } else {
    console.log("Неожиданная ошибка в тесте максимального количества (не Error):", outerError);
  }
}

// Финальная проверка состояния корзины
console.log("\n=== Финальная проверка состояния корзины ===");
console.log("Пуста ли корзина после всех тестов:", basket.isEmpty);
console.log("Содержимое корзины:", basket.products);

// Создаём экземпляр класса Buyer
const buyer = new Buyer();

console.log("=== Тестирование класса Buyer ===");

// Проверка начальных данных
console.log("\n--- Тест 1: Начальное состояние покупателя ---");
console.log("Начальные данные покупателя:", buyer.buyerData);
console.log("Форма валидна:", buyer.isValid());
console.log("Ошибки валидации:", buyer.validateForm());

// Тест 2: Заполнение неполных данных
console.log("\n--- Тест 2: Заполнение неполных данных ---");
const incompleteBuyerData: Partial<IBuyer> = {
  payment: "cash",
  address: "Рафаэля Сафиуллина 36",
};
buyer.buyerData = incompleteBuyerData;
console.log("Данные после заполнения неполной информации:", buyer.buyerData);

const errorsIncomplete = buyer.validateForm();
console.log("Ошибки валидации неполных данных:", errorsIncomplete);
console.log("Форма валидна (неполные данные):", buyer.isValid());

// Тест 3: Заполнение полных данных
console.log("\n--- Тест 3: Заполнение полных данных ---");
const completeBuyerData: IBuyer = {
  payment: "card",
  address: "Молостовых 2к2",
  phone: "89530939108",
  email: "emilia_bekker@mail.ru",
};
buyer.buyerData = completeBuyerData;
console.log("Данные после заполнения полной информации:", buyer.buyerData);

const errorsComplete = buyer.validateForm();
console.log("Ошибки валидации полных данных:", errorsComplete);
console.log("Форма валидна (полные данные):", buyer.isValid());

// Тест 4: Проверка валидации некорректных данных
console.log("\n--- Тест 4: Валидация некорректных данных ---");

// Некорректный телефон
const invalidPhoneData: Partial<IBuyer> = {
  ...completeBuyerData,
  phone: "123",
};
buyer.buyerData = invalidPhoneData;
console.log("Данные с некорректным телефоном:", buyer.buyerData);
console.log("Ошибки валидации (некорректный телефон):", buyer.validateForm());

// Некорректный email
const invalidEmailData: Partial<IBuyer> = {
  ...completeBuyerData,
  email: "invalid-email",
};
buyer.buyerData = invalidEmailData;
console.log("Данные с некорректным email:", buyer.buyerData);
console.log("Ошибки валидации (некорректный email):", buyer.validateForm());

// Пустой адрес
const emptyAddressData: Partial<IBuyer> = {
  ...completeBuyerData,
  address: "",
};
buyer.buyerData = emptyAddressData;
console.log("Данные с пустым адресом:", buyer.buyerData);
console.log("Ошибки валидации (пустой адрес):", buyer.validateForm());

// Тест 5: Очистка данных
console.log("\n--- Тест 5: Очистка данных покупателя ---");
buyer.clearBuyerData();
console.log("Данные после очистки:", buyer.buyerData);
console.log("Форма валидна после очистки:", buyer.isValid());
console.log("Ошибки после очистки:", buyer.validateForm());

// Тест 6: Последовательное заполнение данных
console.log("\n--- Тест 6: Последовательное заполнение данных ---");
// Сначала заполняем обязательные поля
buyer.buyerData = {
  address: "Новый адрес",
  phone: "89530939108",
  email: "test@example.com",
};
console.log("После заполнения контактных данных:", buyer.buyerData);
console.log("Ошибки:", buyer.validateForm());

// Затем добавляем способ оплаты
buyer.buyerData = { payment: "card" };
console.log("После добавления способа оплаты:", buyer.buyerData);
console.log("Теперь форма валидна:", buyer.isValid());

// Финальная проверка состояния
console.log("\n=== Финальная проверка состояния Buyer ===");
console.log("Текущие данные покупателя:", buyer.buyerData);
console.log("Все ошибки валидации:", buyer.validateForm());
console.log("Общая валидность формы:", buyer.isValid());

console.log("=== ПОЛУЧЕНИЕ ДАННЫХ С СЕРВЕРА ===");

const api = new Api(API_URL);
const catalogService = new CatalogService(api);

try {
  console.log("Отправка запроса на получение каталога товаров...");
  const catalogResponse = await catalogService.getCatalogProducts();

  // Проверка структуры ответа
  console.log("Ответ от сервера получен. Проверяем структуру данных...");

  if (!catalogResponse) {
    throw new Error("Получен пустой ответ от сервера");
  }

  if (!Array.isArray(catalogResponse.items)) {
    console.warn(
      'Предупреждение: поле "items" не является массивом. Пытаемся преобразовать...',
    );
    if (catalogResponse.items && typeof catalogResponse.items === "object") {
      catalogResponse.items = Object.values(catalogResponse.items);
    } else {
      throw new Error(
        "Ответ сервера не содержит данных о товарах в ожидаемом формате",
      );
    }
  }

  console.log(`Получено ${catalogResponse.items.length} товаров из API`);

  // Дополнительная проверка: есть ли товары в ответе
  if (catalogResponse.items.length === 0) {
    console.warn("Внимание: сервер вернул пустой каталог товаров");
  } else {
    // Выводим информацию о первых 3 товарах для проверки
    console.log("Первые 3 товара из ответа сервера:");
    catalogResponse.items.slice(0, 3).forEach((product, index) => {
      console.log(
        `Товар ${index + 1}: ID=${product.id}, Название="${product.title}", Цена=${product.price}`,
      );
    });
  }

  // Заполняем каталог полученными данными
  catalog.catalogData = catalogResponse.items;
  console.log("Каталог успешно заполнен данными с сервера");

  // Проверяем, что данные действительно записались в каталог
  console.log(
    `Текущее количество товаров в каталоге: ${catalog.catalogData.length}`,
  );

  // Выводим общую информацию о каталоге
  if (catalog.catalogData.length > 0) {
    const totalPrice = catalog.catalogData.reduce(
      (sum, product) => sum + (product.price ?? 0),
      0,
    );
    const minPrice = Math.min(
      ...catalog.catalogData.map((product) => product.price ?? 0),
    );
    const maxPrice = Math.max(
      ...catalog.catalogData.map((product) => product.price ?? 0),
    );

    console.log("Статистика по каталогу:");
    console.log(`- Общее количество товаров: ${catalog.catalogData.length}`);
    console.log(`- Общая стоимость всех товаров: ${totalPrice}`);
    console.log(`- Минимальная цена: ${minPrice}`);
    console.log(`- Максимальная цена: ${maxPrice}`);
  }
} catch (e) {
  console.error("Не удалось получить каталог с сервера:");
  console.error("Тип ошибки:", e instanceof Error ? e.name : typeof e);
  console.error(
    "Сообщение об ошибке:",
    e instanceof Error ? e.message : String(e),
  );

  // Дополнительная информация об ошибке в зависимости от типа
  if (e instanceof Error && e.message.includes("404")) {
    console.error("Ошибка 404: ресурс не найден. Проверьте URL API");
  } else if (e instanceof Error && e.message.includes("Network")) {
    console.error(
      "Сетевая ошибка: проверьте подключение к интернету или доступность сервера",
    );
  } else if (e instanceof Error && e.message.includes("500")) {
    console.error("Ошибка сервера (500): внутренняя ошибка на стороне сервера");
  }

  console.warn("Продолжим работу с локальным каталогом (если доступен)");
}
