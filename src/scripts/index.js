import "../pages/index.css";
import logoImage from "../images/logo.svg";
import { createCard, likeCard } from "../components/card.js";
import { openPopup,closePopup,closePopupOnOverlayClick } from "../components/modal.js";
import { enableValidation, clearValidation  } from "../components/validation.js";
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, deleteCardFromServer, updateAvatar } from "../components/api.js";

// --- получение нужных эл-тов ---
const cardList = document.querySelector(".places__list");
const ImagePopup = document.querySelector(".popup_type_image");
const cardTemplate = document.querySelector("#card-template").content;

// --- установка логотипа ---
const logoElement = document.querySelector(".header__logo");
logoElement.src = logoImage;

// --- всплювающие окна ---
const deletePopup = document.querySelector(".popup_type_delete-card");
const profilePopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const avatarPopup = document.querySelector(".popup_type_change-avatar");
const popups = document.querySelectorAll(".popup");

// --- кнопки попапов ---
const closeButton = document.querySelectorAll(".popup__close");
const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const confirmDeleteButton = deletePopup.querySelector(".button__card-delete");

// --- инпуты форм внесения изменений в профиль и добавления новой карточки ---
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");
const cardNameInput = document.querySelector(".popup__input_type_card-name");
const urlCardInput = document.querySelector(".popup__input_type_url");

// --- DOM элементы профиля пользователя ---
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

// --- форма смены картинки аватара ---
const avatarForm = avatarPopup.querySelector('form[name="change-avatar"]');

// --- переменные ---
let currentUserId = null;
let cardIdToDelete = null;
let cardElementToDelete = null;

// --- колбэки(удаление карточки, лайк карточки и увеличение картинки) ---
const callbacks = {
  deleteCard: (cardId, cardElement) => {
    cardIdToDelete = cardId;
    cardElementToDelete = cardElement;
    openPopup(deletePopup);
  },
  likeCard,
  increaseImage,
};

// --- функция добавления карточки ---
function addCard(item, method = "append", userId) {
  const cardElement = createCard(item, callbacks, cardTemplate, userId);
  cardList[method](cardElement);
}

// --- открытие картинки карточки в развёрнутом виде ---
function increaseImage(src, textContent) {
  const srcPopup = ImagePopup.querySelector(".popup__image");
  const textPopup = ImagePopup.querySelector(".popup__caption");
  srcPopup.src = src;
  srcPopup.alt = textContent;
  textPopup.textContent = textContent;
  openPopup(ImagePopup);
}

// --- функция заполнения полей формы существующими значениями ---
function fillProfileForm() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
}

// --- функция обновления данных о пользователе ---
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = profilePopup.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  submitButton.textContent = "Сохранение...";

  const newName = nameInput.value;
  const newAbout = jobInput.value;

  updateUserInfo(newName, newAbout)
    .then((data) => {
      profileName.textContent = data.name;
      profileJob.textContent = data.about;
      closePopup(profilePopup);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

// --- добавление новой карточки ---
function handleAddCard(evt) {
  evt.preventDefault();

  const submitButton = newCardPopup.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  submitButton.textContent = "Сохранение...";

  const cardData = {
    name: cardNameInput.value,
    link: urlCardInput.value,
  };

  addNewCard(cardData)
    .then((newCardFromServer) => {
      addCard(newCardFromServer, "prepend", currentUserId);
      closePopup(newCardPopup);
      evt.target.reset();
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

// --- удаление карточки с сервера ---
function handleDeleteCardConfirm(event) {
  event.preventDefault();

  const originalText = confirmDeleteButton.textContent;
  confirmDeleteButton.textContent = "Удаление...";
  confirmDeleteButton.disabled = true;

  deleteCardFromServer(cardIdToDelete)
    .then(() => {
      cardElementToDelete.remove();
      closePopup(deletePopup);
      cardIdToDelete = null;
      cardElementToDelete = null;
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
    })
    .finally(() => {
      confirmDeleteButton.textContent = originalText;
      confirmDeleteButton.disabled = false;
    });
}

// --- смена аватара пользователя ---
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = avatarForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  submitButton.textContent = "Сохранение...";

  const link = avatarForm.link.value.trim();

  updateAvatar(link)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(avatarPopup);
      avatarForm.reset();
    })
    .catch((err) => {
      console.error("Ошибка обновления аватара:", err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

// --- объект(настройки для валидации) ---
export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button-disabled",
  inputErrorClass: "popup__input-invalid",
  errorClass: "popup__input-error-visible",
};

// --- обработчики кнопок и форм ---
editProfileButton.addEventListener("click", () => {
  fillProfileForm();
  clearValidation(profilePopup.querySelector(validationConfig.formSelector), validationConfig);
  openPopup(profilePopup);
});

addCardButton.addEventListener("click", () => {
  clearValidation(newCardPopup.querySelector(validationConfig.formSelector), validationConfig);
  openPopup(newCardPopup);
});

closeButton.forEach((button) => {
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

profilePopup.addEventListener("submit", handleProfileFormSubmit);
newCardPopup.addEventListener("submit", handleAddCard);
confirmDeleteButton.addEventListener("click", handleDeleteCardConfirm);

profileAvatar.addEventListener("click", () => {
  openPopup(avatarPopup);
});

avatarForm.addEventListener("submit", handleAvatarFormSubmit);

// --- включение валидации ---
enableValidation(validationConfig);

// --- загрузка данных пользователя и карточек одновременно ---
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileName.textContent = userData.name;
    profileJob.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        callbacks,
        cardTemplate,
        currentUserId
      );
      cardList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error("Ошибка при загрузке данных:", err);
  });

