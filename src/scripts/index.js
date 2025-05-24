import "../pages/index.css";
import logoImage from "../images/logo.svg";
import { createCard, likeCard, deleteCard } from "../components/card.js";
import { openPopup,closePopup,closePopupOnOverlayClick } from "../components/modal.js";
import { enableValidation } from "../components/validation.js";
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, deleteCardFromServer, updateAvatar } from "../components/api.js";

// --- получение нужных эл-тов ---
const cardList = document.querySelector(".places__list");
const ImagePopup = document.querySelector(".popup_type_image");
const cardTemplate = document.querySelector("#card-template").content;

// --- установка фото Жака-Ив Кусто и логотипа ---
const logoElement = document.querySelector(".header__logo");
logoElement.src = logoImage;

const deletePopup = document.querySelector(".popup_type_delete-card");

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
// --- поля формы изменения профиля ---
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

// --- функция обновления данных о пользователе(используется функция "updateUserInfo") ---
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

profilePopup.addEventListener("submit", handleProfileFormSubmit);

// --- добавление новой карточки (пункт 6) ---
const cardNameInput = document.querySelector(".popup__input_type_card-name");
const urlCardInput = document.querySelector(".popup__input_type_url");

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

newCardPopup.addEventListener("submit", handleAddCard);

//   6 спринт   //

// --- объект(настройки для валидации) ---
export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button-disabled",
  inputErrorClass: "popup__input-invalid",
  errorClass: "popup__input-error-visible",
};

// --- включение валидации ---
enableValidation(validationConfig);

// --- вывод в консоль инеформации о пользователе (просто для себя) НЕОБЯЗАТЕЛЬНО ---
getUserInfo()
  .then((data) => {
    console.log("Данные пользователя с сервера:", data);
  })
  .catch((err) => {
    console.error("Ошибка при получении данных:", err);
  });

// --- вывод в консоль карточки (просто для себя) НЕОБЯЗАТЕЛЬНО --- 
getInitialCards()
  .then((cards) => {
    console.log("Карточки с сервера:", cards);
  })
  .catch((err) => {
    console.error("Ошибка при получении карточек:", err);
  });

let currentUserId = null;

// --- загрузка данных пользователя и карточек одновременно ---
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    const profileName = document.querySelector(".profile__title");
    const profileAbout = document.querySelector(".profile__description");
    const profileImage = document.querySelector(".profile__image");

    profileName.textContent = userData.name;
    profileAbout.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

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

// --- удаление карточки с сервера ---
let cardIdToDelete = null;
let cardElementToDelete = null;
const confirmDeleteButton = deletePopup.querySelector(".button__card-delete");

confirmDeleteButton.addEventListener("click", (event) => {
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
});

// --- смена аватара пользователя ---
const avatarPopup = document.querySelector(".popup_type_change-avatar");
const avatarForm = avatarPopup.querySelector('form[name="change-avatar"]');
const profileAvatar = document.querySelector(".profile__image");

// --- открытие попапа по клику на див с аватаром ---
profileAvatar.addEventListener("click", () => {
  openPopup(avatarPopup);
});

avatarForm.addEventListener("submit", (evt) => {
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
});
