export function deleteCard(item) {
  item.remove();
}

export function likeCard(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

// --- Функция создания карточки ---
export function createCard(cardData, callbacks, cardTemplate) {
  const cardElement = cardTemplate.cloneNode(true);
  const card = cardElement.querySelector(".places__item");

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  //--- переменная для 7 пункта ---
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener("click", () => {
    callbacks.deleteCard(card);
  });

  // --- для 7 пункта ---
  likeButton.addEventListener("click", () => {
    callbacks.likeCard(likeButton);
  });

  //для --- 8 пункта ---
  cardImage.addEventListener("click", () => {
    callbacks.increaseImage(cardImage.src, cardTitle.textContent);
  });

  return card;
}
