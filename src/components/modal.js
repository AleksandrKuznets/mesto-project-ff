export function openPopup(popup) {
  popup.classList.add("popup_is-opened");

  // --- Функция закрытия Popup через esc ---
  function esc(event) {
    if (event.key === "Escape") {
      closePopup(popup);
      document.removeEventListener("keydown", esc);
    }
  }

  document.addEventListener("keydown", esc);
}

// --- функция закрытия Popup ---
export function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
}
