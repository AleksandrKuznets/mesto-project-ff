import { clearValidation } from "../components/validation.js";
import { validationConfig } from "../scripts/index.js";

export function closePopupOnOverlayClick(event) {
  if (event.target === event.currentTarget) {
    closePopup(event.currentTarget);
  }
}

export function closePopupByEsc(event) {
  if (event.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

export function openPopup(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closePopupByEsc);
  const form = popup.querySelector(validationConfig.formSelector);
  if (form) {
    clearValidation(form, validationConfig);

    // --- если форма добавления карточки — очищаем значения инпутов ---
    if (popup.classList.contains("popup_type_new-card")) {
      const inputs = form.querySelectorAll(validationConfig.inputSelector);
      inputs.forEach((input) => {
        input.value = "";
      });
    }
  }
}

export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closePopupByEsc);
}
