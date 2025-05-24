import { addLikeToServer, removeLikeFromServer } from "./api";
import { openPopup } from "./modal";

export function deleteCard(cardId, cardElement) {
  cardIdToDelete = cardId;
  cardElementToDelete = cardElement;
  openPopup(deletePopup)
}

export function likeCard(cardId, likeButton, likeCounter) {
  const liked = likeButton.classList.contains("card__like-button_is-active");

  let apiCall;

  if (liked) {
    apiCall = removeLikeFromServer;
  } 
  else {
    apiCall = addLikeToServer;
  }

  apiCall(cardId)
    .then((updatedCard) => {
      likeCounter.textContent = updatedCard.likes.length;
      likeButton.classList.toggle("card__like-button_is-active", !liked);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении лайка:", err);
    });
}

export function createCard(cardData, callbacks, cardTemplate, userId) {
  const cardElement = cardTemplate.cloneNode(true);
  const card = cardElement.querySelector(".places__item");

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  likeCounter.textContent = cardData.likes.length;

  // --- если текущий пользователь есть в массиве лайков — активируем лайк ---
  if (cardData.likes.some(user => user._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // --- показываем кнопку удаления, если карточка принадлежит текущему пользователю ---
  if (cardData.owner && cardData.owner._id === userId) {
    deleteButton.style.display = "block";
  } else {
    deleteButton.style.display = "none";
  }

  deleteButton.addEventListener("click", () => {
    callbacks.deleteCard(cardData._id, card);
  });

  likeButton.addEventListener("click", () => {
    callbacks.likeCard(cardData._id, likeButton, likeCounter);
  });

  cardImage.addEventListener("click", () => {
    callbacks.increaseImage(cardImage.src, cardTitle.textContent);
  });

  return card;
}
