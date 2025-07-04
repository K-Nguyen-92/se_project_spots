import { enableValidation, settings } from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

const profileEditButton = document.querySelector(".profile__edit");
const editModal = document.querySelector("#edit-modal");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editModalNameInput = editModal.querySelector("#current-profile-name");
const editModalDescriptionInput = editModal.querySelector(
  "#current-profile-description"
);
const editFormSubmit = editModal.querySelector(".modal__form");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const newPostButton = document.querySelector(".profile__new-post");
const newPostModal = document.querySelector("#new-post-modal");
const newPostSubmit = newPostModal.querySelector(".modal__form");
const newPostCaptionInput = newPostModal.querySelector("#new-post-caption");
const newPostLinkInput = newPostModal.querySelector("#new-post-link-input");
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const closeButtons = document.querySelectorAll(".modal__close-button");
const modals = document.querySelectorAll(".modal");
const avatarButton = document.querySelector(".profile__avatar-button");
const avatarModal = document.querySelector("#avatar-modal");
const avatarSubmit = avatarModal.querySelector(".modal__form");
const avatarLinkInput = avatarModal.querySelector("#avatar-link-input");
const profileAvatar = document.querySelector(".profile__avatar");
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
let selectedCard, selectedCardId;
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "6446b242-4317-4c66-80e0-e27bc7ea59c0",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([initialCards, userInfo]) => {
    initialCards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
  })
  .catch(console.error);

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEditFormSubmit(e) {
  e.preventDefault();
  setButtonText(e.submitter, true);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(e.submitter, false);
    });
}

function handleNewPostSubmit(e) {
  e.preventDefault();
  setButtonText(e.submitter, true);
  console.log(e.submitter.textContent);
  api
    .createCard({
      name: newPostCaptionInput.value,
      link: newPostLinkInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      closeModal(newPostModal);
      e.target.reset();
      disableButton(e.submitter, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(e.submitter, false);
    });
}

function handleAvatarSubmit(e) {
  e.preventDefault();
  setButtonText(e.submitter, true);
  api
    .editUserAvatar(avatarLinkInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(e.submitter, false);
    });
  closeModal(avatarModal);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleDeleteSubmit(e) {
  e.preventDefault();
  setButtonText(e.submitter, true, "Delete", "Deleting...");
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(e.submitter, false, "Delete", "Deleting...");
    });
}

function handleLike(e, cardId) {
  const isLiked = true
    ? e.target.classList.contains("card__like-button_liked")
    : !e.target.classList.contains("card__like-button_liked");
  api
    .updateLike(cardId, isLiked)
    .then(() => {
      e.target.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardElementName = cardElement.querySelector(".card__title");
  const cardElementImage = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  cardElementName.textContent = data.name;
  cardElementImage.src = data.link;
  cardElementImage.alt = data.name;
  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }
  cardLikeButton.addEventListener("click", (e) => handleLike(e, data._id));
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );
  cardElementImage.addEventListener("click", () => {
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

profileEditButton.addEventListener("click", () => {
  openModal(editModal);
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormSubmit,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
});

editFormSubmit.addEventListener("submit", handleEditFormSubmit);

newPostButton.addEventListener("click", () => openModal(newPostModal));

newPostSubmit.addEventListener("submit", handleNewPostSubmit);

avatarButton.addEventListener("click", () => openModal(avatarModal));

avatarSubmit.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

closeButtons.forEach((button) => {
  const popupModal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popupModal));
});

modals.forEach((button) => {
  const popupModal = button.closest(".modal");
  button.addEventListener("click", (e) => {
    if (e.target === popupModal) {
      closeModal(popupModal);
    }
  });
});

function handleEscape(e) {
  if (e.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}
enableValidation(settings);
