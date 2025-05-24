// --- регулярное выражение для проверки валидности ---
const textRegex = /^[a-zа-яё\s-]+$/i;

// --- показать ошибку ---
function showInputError(input, errorMessage, config) {
  const errorElement = input.nextElementSibling;
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
  input.classList.add(config.inputErrorClass);
}

// --- скрыть ошибку ---
function hideInputError(input, config) {
  const errorElement = input.nextElementSibling;
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);
  input.classList.remove(config.inputErrorClass);
}

// --- проверка поля на валидность ---
function checkInputValidity(input, config) {
  if (!input.validity.valid) {
    showInputError(input, input.validationMessage, config);
    return false;
  }

  if (input.dataset.validate === "text" && !textRegex.test(input.value)) {
    showInputError(
      input,
      "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы",
      config
    );
    return false;
  }

  hideInputError(input, config);
  return true;
}

// --- управление кнопкой ---
function toggleButtonState(inputs, button, config) {
  const isValid = inputs.every((input) => {
    if (input.type === "url") return input.validity.valid;
    return (
      input.validity.valid &&
      (!input.dataset.validate || textRegex.test(input.value))
    );
  });

  button.disabled = !isValid;
  button.classList.toggle(config.inactiveButtonClass, !isValid);
}

// --- навесить слушатели на инпуты в форме и сменить отображение кнопки ---
function setEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(input, config);
      toggleButtonState(inputs, button, config);
    });
  });
}

// --- включение валидации на всех формах ---
export function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => {
    setEventListeners(form, config);
  });
}

// --- очистка валидации при открытии формы ---
export function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    hideInputError(input, config);
  });

  toggleButtonState(inputs, button, config);
}
