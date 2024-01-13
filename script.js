"use strict";

let currentPage = 1;
let rows = 10;
let visiblePages = 3; // Количество отображаемых кнопок пагинации

const API_KEY = "64456a81-12dc-41be-b632-537e6fd2e201";
const URL = "https://edu.std-900.ist.mospolytech.ru/api/routes";

//Функция для отображения уведомлений
function renderAlert(message) {
  document
    .querySelector(".alert-section")
    .classList.add("alert-section-active");
  const alertText = document.querySelector(".alert-text");
  alertText.innerHTML = "";
  alertText.insertAdjacentHTML("beforeend", message);
}

//Получение данных о маршрутах
function getRouteData() {
  fetch(`${URL}?api_key=${API_KEY}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Произошла ошибка! (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displayRoutesTable(data, rows, currentPage);
      displayPagination(data, rows);
    })
    .catch((err) => {
      console.log(err);
      renderAlert(
        `Что-то пошло не так из-за ошибки ${err.message}! Попробуйте позже!`
      );
    });
}

getRouteData();

// Отображение таблицы маршрутов
function displayRoutesTable(data, rowPerPage, page) {
  const tableBody = document.querySelector(".table-body");

  tableBody.innerHTML = "";
  page--;

  const start = rowPerPage * page;
  const end = start + rowPerPage;
  const paginatedData = data.slice(start, end);

  for (let i = 0; i < paginatedData.length; i++) {
    let row = `
            <tr class="table-row" data-route-id="${paginatedData[i].id}">
              <td class="table-element">${paginatedData[i].name}</td>
              <td class="table-element">${paginatedData[i].description}</td>
              <td class="table-element">${paginatedData[i].mainObject}</td>
              <td class="table-element mx-auto">
                <button class="tableBtn fs-5 rounded-1 fw-semibold text-white" onclick="selectRoute('${paginatedData[i].name}', '${paginatedData[i].id}')">Выбрать</button>
              </td>
            </tr>
            `;
    tableBody.insertAdjacentHTML("beforeend", row);
  }
}

// Функция для выбора маршрута
function selectRoute(routeName, routeID) {
  const spanElement = document.querySelector(".route-name");
  spanElement.textContent = routeName;

  const tableRows = document.querySelectorAll(".table-row");

  tableRows.forEach((row) => {
    row.classList.remove("backgroundChange");
  });

  const selectedRow = document.querySelector(
    `.table-row[data-route-id="${routeID}"]`
  );
  if (selectedRow) {
    selectedRow.classList.add("backgroundChange");
  }

  getGuideData(routeID);
}

//Получение данных о гидах
function getGuideData(routeID) {
  fetch(`${URL}/${routeID}/guides?api_key=${API_KEY}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Произошла ошибка! (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displayGuidesTable(data);
      displayLanguageList(data);
    })
    .catch((err) => {
      console.log(err);
      renderAlert(
        `Что-то пошло не так из-за ошибки ${err.message}! Попробуйте позже!`
      );
    });
}

//Отображение списка языков
function displayLanguageList(data) {
  const languageList = document.querySelector("#list-language");

  languageList.innerHTML = "";

  //Уникальные значения языков
  const uniqueLanguages = new Set(data.map((guide) => guide.language));

  //Set в массив и сортировка по алфавиту
  const uniqueLanguagesArray = [...uniqueLanguages].sort();

  languageList.insertAdjacentHTML(
    "beforeend",
    `<option value="1" selected disabled>Не выбрано</option>`
  );

  for (let i = 2; i < uniqueLanguagesArray.length; i++) {
    let languageListItem = `
      <option value="${uniqueLanguagesArray[i]}">${uniqueLanguagesArray[i]}</option>
    `;

    languageList.insertAdjacentHTML("beforeend", languageListItem);
  }

  //Обработчик событий на изменение значения в списке языков
  languageList.addEventListener("change", () => {
    const selectedLanguage = languageList.value;
    //Сброс значения в полях input опыта работы при выборе языка
    document.getElementById("experience-start").value = "";
    document.getElementById("experience-end").value = "";
    filterGuidesByLanguage(data, selectedLanguage);
  });

  // Обработчики событий для фильтрации гидов при изменении значений в полях input опыта работы
  document
    .getElementById("experience-start")
    .addEventListener("input", function () {
      filterGuidesByExperience(data);
    });

  document
    .getElementById("experience-end")
    .addEventListener("input", function () {
      filterGuidesByExperience(data);
    });
}

// Фильтрация гидов по выбранному языку
function filterGuidesByLanguage(data, selectedLanguage) {
  const filteredGuides = data.filter(
    (guide) => guide.language === selectedLanguage
  );
  displayGuidesTable(filteredGuides);
}

// Отображение таблицы гидов
function displayGuidesTable(data) {
  const tableGuideBody = document.querySelector(".table-guide-body");

  tableGuideBody.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    let guideInf = `
    <tr class="table-guide-row" data-guide-id="${data[i].id}">
      <td class="table-guide-element">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="bi bi-person-bounding-box"
          viewBox="0 0 16 16"
        >
          <path
            d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5"
          />
          <path
            d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
          />
        </svg>
      </td>
      <td class="table-guide-element">${data[i].name}</td>
      <td class="table-guide-element">${data[i].language}</td>
      <td class="table-guide-element">${
        data[i].workExperience +
        " " +
        getExperienceString(data[i].workExperience)
      }
      </td>
      <td class="table-guide-element">${data[i].pricePerHour + "₽"}</td>
      <td class="table-guide-element mx-auto">
        <button class="tableBtn fs-5 rounded-1 fw-semibold text-white" onclick="selectGuide('${
          data[i].id
        }')">Выбрать</button>
      </td>
    </tr>
            `;
    tableGuideBody.insertAdjacentHTML("beforeend", guideInf);
  }
}

//Выбор гида - смена фона
function selectGuide(guideID) {
  const tableGuideRows = document.querySelectorAll(".table-guide-row");

  tableGuideRows.forEach((row) => {
    row.classList.remove("backgroundChange");
  });

  const selectedRow = document.querySelector(
    `.table-guide-row[data-guide-id="${guideID}"]`
  );
  if (selectedRow) {
    selectedRow.classList.add("backgroundChange");
  }
}

//Получаем слово для отображения после значения опыта работы
function getExperienceString(workExperience) {
  let experienceValue = workExperience % 100;
  if (experienceValue >= 10 && experienceValue <= 20) {
    return "лет";
  } else {
    experienceValue = workExperience % 10;
    if (experienceValue === 1) {
      return "год";
    } else if (experienceValue >= 2 && experienceValue <= 4) {
      return "года";
    } else {
      return "лет";
    }
  }
}

// Отображение пагинации
function displayPagination(data, rowPerPage) {
  const paginationEl = document.querySelector(".pagination");
  paginationEl.classList.add("justify-content-center");
  const pagesCount = Math.ceil(data.length / rowPerPage);

  // Вычисление начальной и конечной страницы для отображения
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = Math.min(startPage + visiblePages - 1, pagesCount);

  // Проверка, чтобы не выйти за границы
  startPage = Math.max(1, endPage - visiblePages + 1);

  // Создание кнопок для "предыдущей" и "следующей" страниц
  const prevBtn = createPaginationBtn(
    "Предыдущая",
    data,
    rowPerPage,
    currentPage - 1
  );
  const nextBtn = createPaginationBtn(
    "Следующая",
    data,
    rowPerPage,
    currentPage + 1
  );

  // Создание списка для элементов кнопок для отображения страниц
  const btnPages = document.createElement("ul");
  btnPages.classList.add("pagination");

  for (let i = startPage; i <= endPage; i++) {
    const btnPage = createPaginationBtn(i, data, rowPerPage, i);
    btnPages.append(btnPage);
  }

  paginationEl.innerHTML = ""; // Очистка пагинации перед обновлением
  if (currentPage > 1) {
    paginationEl.appendChild(prevBtn);
  }
  paginationEl.append(btnPages);
  if (currentPage < pagesCount) {
    paginationEl.appendChild(nextBtn);
  }
}

// Создание кнопок для пагинации
function createPaginationBtn(label, data, rows, targetPage) {
  const pageItem = document.createElement("li");
  pageItem.classList.add("page-item");

  const pageLink = document.createElement("a");
  pageLink.classList.add("page-link");
  pageLink.classList.add("text-dark");
  pageLink.classList.add("fw-semibold");
  pageLink.classList.add("paginationBtn");
  pageLink.classList.add("rounded-0");
  pageLink.innerText = label;

  pageLink.addEventListener("click", (e) => {
    e.preventDefault();

    if (targetPage >= 1 && targetPage <= Math.ceil(data.length / rows)) {
      currentPage = targetPage;
      displayRoutesTable(data, rows, currentPage);
      displayPagination(data, rows);
    }
  });

  pageItem.appendChild(pageLink);
  return pageItem;
}

// Функция для фильтрации гидов по опыту работы:
function filterGuidesByExperience(data) {
  const startValue = parseInt(
    document.getElementById("experience-start").value,
    10
  );
  const endValue = parseInt(
    document.getElementById("experience-end").value,
    10
  );

  const filteredGuides = data
    .filter(
      (guide) =>
        guide.workExperience >= startValue && guide.workExperience <= endValue
    )
    .sort((a, b) => b.workExperience - a.workExperience);

  displayGuidesTable(filteredGuides);
}
