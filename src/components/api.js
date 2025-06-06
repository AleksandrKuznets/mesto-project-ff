const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/wff-cohort-39",
  headers: {
    authorization: "392de237-2a9a-4a40-bf92-c1061fe7c271",
    "Content-Type": "application/json",
  },
};

// --- проверка успешности ответа от сервера ---
const checkSuccess = (res) => {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
};

// --- получение данных о пользователе с сервера ---
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(checkSuccess);
};

// --- получение карточек с сервера ---
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(checkSuccess);
};

// --- обновление данных о пользователе ---
export const updateUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ name, about }),
  }).then(checkSuccess);
};

// --- добавление новой карточки ---
export const addNewCard = (cardData) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: cardData.name,
      link: cardData.link,
    }),
  }).then(checkSuccess);
};

// --- добавление лайка ---
export function addLikeToServer(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  }).then(checkSuccess);
}

// --- удаление лайка ---
export function removeLikeFromServer(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(checkSuccess);
}

// --- удаление карточки ---
export const deleteCardFromServer = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(checkSuccess);
};

// --- обновление аватара пользователя ---
export function updateAvatar(link) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ avatar: link }),
  }).then(checkSuccess);
}
