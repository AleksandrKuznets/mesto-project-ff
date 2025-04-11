// @todo: Темплейт карточки
//получение нужных эл-тов
const cardList = document.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template").content;

// @todo: Функция создания карточки
function createCard(cardData, deleteCard) {
  const cardElement = cardTemplate.cloneNode(true);
  const card = cardElement.querySelector(".places__item");

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = cardData.link;
  cardTitle.textContent = cardData.name;

  cardList.append(card);

  deleteButton.addEventListener("click", () => {
    deleteCard(card);
  });
  return card;
}

// @todo: Функция удаления карточки
function deleteCard(item) {
  item.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach((element) => {
  createCard(element, deleteCard);
});
