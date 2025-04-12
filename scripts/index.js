const initialCards = [
  // {
  //   name: "Golden Gate Bridge",
  //   link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  // },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrance",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long, bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

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

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleEditFormSubmit(e) {
  e.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleNewPostSubmit(e) {
  e.preventDefault();
  const newPostInput = {
    name: newPostCaptionInput.value,
    link: newPostLinkInput.value,
  };
  const cardElement = getCardElement(newPostInput);
  cardsList.prepend(cardElement);
  closeModal(newPostModal);
  e.target.reset();
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
  cardLikeButton.addEventListener("click", () =>
    cardLikeButton.classList.toggle("card__like-button_liked")
  );
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardDeleteButton.addEventListener("click", () =>
    cardDeleteButton.closest(".card").remove()
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
});

editFormSubmit.addEventListener("submit", handleEditFormSubmit);

newPostButton.addEventListener("click", () => openModal(newPostModal));

newPostSubmit.addEventListener("submit", handleNewPostSubmit);

initialCards.forEach((card) => {
  const cardElement = getCardElement(card);
  cardsList.append(cardElement);
});

closeButtons.forEach((button) => {
  const popupModal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popupModal));
});

// OUTDATED CODE --- ARCHIVE
// const editCloseButton = editModal.querySelector(".modal__close-button");
// const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
// const previewModalCloseButton = previewModal.querySelector(
//   ".modal__close-button"
// );
// editCloseButton.addEventListener("click", () => {
//   closeModal(editModal);
// });
// newPostCloseButton.addEventListener("click", () => {
//   closeModal(newPostModal);
// });
// previewModalCloseButton.addEventListener("click", () => {
//   closeModal(previewModal);
// });
