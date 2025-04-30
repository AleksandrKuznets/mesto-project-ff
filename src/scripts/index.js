import "../pages/index.css";
import { initialCards } from "./cards";
import avatar from "../images/avatar.jpg";
import logoImage from "../images/logo.svg";
import { createCard, likeCard, deleteCard } from "../components/card.js";
import {
  openPopup,
  closePopup,
  closePopupOnOverlayClick,
} from "../components/modal.js";

// --- получение нужных эл-тов ---
const cardList = document.querySelector(".places__list");
const ImagePopup = document.querySelector(".popup_type_image");
const cardTemplate = document.querySelector("#card-template").content;

// --- установка фото Жака-Ив Кусто и логотипа ---
const logoElement = document.querySelector(".header__logo");
logoElement.src = logoImage;
const avatarElement = document.querySelector(".profile__image");
avatarElement.setAttribute("style", `background-image: url(${avatar})`);

// --- колбэки(удаление карточки, лайк карточки и увеличение картинки) ---
const callbacks = {
  deleteCard,
  likeCard,
  increaseImage,
};

// --- функция добавления карточки ---
function addCard(item, method = "append") {
  const cardElement = createCard(item, callbacks, cardTemplate);
  cardList[method](cardElement);
}

// --- вывод карточек на страницу ---
initialCards.forEach((element) => {
  addCard(element);
});

// --- открытие картинки карточки в развёрнутом виде ---
function increaseImage(src, textContent) {
  const srcPopup = ImagePopup.querySelector(".popup__image");
  const textPopup = ImagePopup.querySelector(".popup__caption");
  srcPopup.src = src;
  textPopup.textContent = textContent;
  openPopup(ImagePopup);
}

// --- глобальные переменные для открытия и закрытия popup'ов (3 пункт) ---
const closeButtons = document.querySelectorAll(".popup__close");
const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const profilePopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const popups = document.querySelectorAll(".popup");

addCardButton.addEventListener("click", () => {
  openPopup(newCardPopup);
});

editProfileButton.addEventListener("click", () => {
  fillProfileForm();
  openPopup(profilePopup);
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const popupToClose = button.closest(".popup");
    closePopup(popupToClose);
  });
});

popups.forEach((popup) => {
  popup.addEventListener("click", (event) => {
    closePopupOnOverlayClick(event);
  });
});

// --- изменения данных в форме о редактировании профиля (4 пункт) ---
// --- поля формы в DOM ---
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

// --- поля существующих значений ---
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");

// --- функция заполнения полей формы существующими значениями ---
function fillProfileForm() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
}

// --- Обработчик «отправки» формы ---
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;

  closePopup(profilePopup);
}

profilePopup.addEventListener("submit", handleProfileFormSubmit);

// --- добавление новой карточки (пункт 6) ---
const cardNameInput = document.querySelector(".popup__input_type_card-name");
const urlCardInput = document.querySelector(".popup__input_type_url");

function handleAddCard(evt) {
  evt.preventDefault();

  const newCard = {
    name: cardNameInput.value,
    link: urlCardInput.value,
  };

  addCard(newCard, "prepend");
  closePopup(newCardPopup);
  evt.target.reset();
}

newCardPopup.addEventListener("submit", handleAddCard);
