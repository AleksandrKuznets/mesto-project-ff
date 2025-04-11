//получение нужных эл-тов
const cardList = document.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template").content;

//Функция создания карточки
function createCard(cardData, callbacks/*я передал, потому что по заданию сюда нужно передавать, но и без этого работает, так как callbacks в области видимости для createCard*/) {
  const cardElement = cardTemplate.cloneNode(true);
  const card = cardElement.querySelector(".places__item");

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener("click", () => {
    callbacks.deleteCard(card);
  });

  return card;
}

const callbacks = {
  deleteCard: (item) => item.remove(),
};

//функция добавленя карточки
function addCard(item, method = "append") {
  const cardElement = createCard(item, callbacks);
  cardList[method](cardElement);
}

//вывод карточек на страницу
initialCards.forEach((element) => {
  addCard(element);
});
