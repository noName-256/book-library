/* #region  functions */
/* #region  book create and set functions */
function setDefaultBookCover(coverElement) {
  function getNextCoverNumber() {
    currentDefaultCoverNumber++;
    if (currentDefaultCoverNumber > totalNumberOfDefaultCovers)
      currentDefaultCoverNumber -= totalNumberOfDefaultCovers;
    return currentDefaultCoverNumber;
  }
  let cover = `url(./covers/cover-${getNextCoverNumber()}.jpg)`;
  coverElement.style.backgroundImage = cover;
}
function addReadButtonListener(readButton) {
  function toggleRead(event) {
    let readButton = event.target;
    let outerCard =
      readButton.parentElement
        .parentElement; /* since the read button is a grandchild of it's outer card element */
    let readData = outerCard.querySelector(".read-data");
    if (outerCard.classList.contains("finished")) {
      /* if book is marked finished/read then we have to mark it unfinished now */
      readButton.textContent = "Not Read";
      readData.textContent = "In progress";
    } else {
      /* otherwise we have to mark it finished */
      readButton.textContent = "Read";
      readData.textContent = "Finished";
    }
    outerCard.classList.toggle("finished");
    reloadHighlights();
    reloadStatistics();
  }
  readButton.addEventListener("click", toggleRead);
}
function addRemoveButtonListener(removeButton) {
  function removeCard(card) {
    card.classList.add("hidden");
    setTimeout(() => {
      card.remove();
      reloadStatistics();
    }, 300);
  }
  function warnAndRemoveCard(event) {
    let removeButton = event.target;
    let outerCard =
      removeButton.parentElement
        .parentElement; /* since the read button is a grandchild of it's outer card element */

    /* check if you are asked to confirm*/
    if (removeButton.textContent === "Are you sure?") removeCard(outerCard);
    else removeButton.textContent = "Remove";

    removeButton.textContent = "Are you sure?";
    function resetText() {
      removeButton.textContent = "Remove";
    }
    setTimeout(resetText, 2500);
  }
  removeButton.addEventListener("click", warnAndRemoveCard);
}
function setBookCoverAndButtons(book, bookData = null) {
  setDefaultBookCover(book.querySelector(".book-cover"));
  if (bookData) setOpenLibraryBookCover(book, bookData);
  addReadButtonListener(book.querySelector("button.read"));
  addRemoveButtonListener(book.querySelector("button.remove"));
}
function setBookData(
  cardElement,
  bookData
) /* bookData has 4 properties: title, author, numberofPages, isFinished */ {
  let titleElement = cardElement.querySelector(
    ".book-data .title-and-author .title"
  );
  titleElement.textContent =
    bookData.title !== "" ? bookData.title : "No Title";
  let authorElement = cardElement.querySelector(
    ".book-data .title-and-author .author"
  );
  authorElement.textContent =
    bookData.author !== "" ? bookData.author : "No author";
  let pagesElement = cardElement.querySelector(".book-data .pages");
  pagesElement.textContent =
    bookData.numberOfPages !== "" ? bookData.numberOfPages : 0;
  pagesElement.textContent += " pages";

  readButton = cardElement.querySelector("button.read");
  readData = cardElement.querySelector(".read-data");
  if (bookData.isFinished) {
    readButton.textContent = "Read";
    readData.textContent = "Finished";
  } else {
    readButton.textContent = "Not Read";
    readData.textContent = "In progress";
  }
  let removeButton = cardElement.querySelector("button.remove");
  removeButton.textContent = "Remove";
}
function createBook(
  bookData
) /* bookData has 4 properties: title, author, numberofPages, isFinished */ {
  let newCard = document.createElement("div");
  newCard.classList.toggle("card");
  if (bookData.isFinished) newCard.classList.toggle("finished");
  let cover = document.createElement("div");
  cover.classList.toggle("book-cover");
  let data = document.createElement("div");
  data.classList.toggle("book-data");
  let titleAndAuthor = document.createElement("div");
  titleAndAuthor.classList.toggle("title-and-author");
  let titleElement = document.createElement("div");
  titleElement.classList.toggle("title");
  let authorElement = document.createElement("div");
  authorElement.classList.toggle("author");
  let pages = document.createElement("div");
  pages.classList.toggle("pages");
  let buttons = document.createElement("div");
  buttons.classList.toggle("buttons");
  let readButton = document.createElement("button");
  readButton.classList.toggle("read");
  let removeButton = document.createElement("button");
  removeButton.classList.toggle("remove");
  let readData = document.createElement("div");
  readData.classList.toggle("read-data");

  newCard.append(cover, data, buttons, readData);
  data.append(titleAndAuthor, pages);
  titleAndAuthor.append(titleElement, authorElement);
  buttons.append(readButton, removeButton);

  setBookData(newCard, bookData);
  setBookCoverAndButtons(newCard, bookData);
  newCard.classList.add("hidden");
  document.querySelector(".books").appendChild(newCard);
  bookDataArr.push(bookData);
  setTimeout(() => newCard.classList.remove("hidden"), 0);
  reloadHighlights();
  reloadStatistics();
}
function createNBooks(numberOfEmptyBooks, bookDataForAll) {
  if (bookDataForAll === "random")
    for (let i = 1; i <= numberOfEmptyBooks; i++)
      createBook(generateRandomBookData());
  else for (let i = 1; i <= numberOfEmptyBooks; i++) createBook(bookDataForAll);
}
/* #region  functions for random generation */
function generateRandomString(length = Math.floor(Math.random() * 30)) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
function generateRandomNumber(minimum = 0, maximum = 10000) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}
function generateRandomBookData() {
  let title = generateRandomString();
  let author = generateRandomString();
  let numberOfPages = generateRandomNumber();
  let isFinished = generateRandomNumber(0, 1) !== 0;
  return new Book(title, author, numberOfPages, isFinished);
}
/* #endregion */
function setAllInitialBooks() {
  let allBooks = document.querySelectorAll(".books .card");
  allBooks.forEach((book) => setBookCoverAndButtons(book));
  reloadStatistics();
}
/* #endregion */
/* #region  popup listeners */
function openPopup() {
  let popup = document.querySelector(".popup-container");
  popup.querySelector("form").reset();
  popup.classList.remove("hidden");
}
function closePopup() {
  let popup = document.querySelector(".popup-container");
  popup.classList.add("hidden");
}
function submitBook() {
  let titleInput = document.querySelector(".popup input#title");
  let authorInput = document.querySelector(".popup input#author");
  let pagesInput = document.querySelector(".popup input#pages");
  let isReadInput = document.querySelector(".popup #is-read");

  let title = titleInput.value;
  let author = authorInput.value;
  let numberOfPages = pagesInput.value;
  let isFinished = isReadInput.checked;
  createBook(new Book(title, author, numberOfPages, isFinished));
  closePopup();
}
function addPopupListeners() {
  let popupSubmitButton = document.querySelector(".popup button#submit-book");
  let popupClose = document.querySelector(".popup img");
  let addBookButton = document.querySelector(".ribbon button");
  popupClose.addEventListener("click", closePopup);
  addBookButton.addEventListener("click", openPopup);
  popupSubmitButton.addEventListener("click", submitBook);
}
/* #endregion */
/* #region  highlight functions, listeners and variables */
/* #region  select highlighting elements(total, read, not read) */
let desktopTotalStatisticElement = document.querySelector(
  ".ribbon .general-information .total:not(.mobile)"
);
let mobileTotalStatisticElement = document.querySelector(
  ".ribbon .general-information .total.mobile"
);
let desktopReadStatisticElement = document.querySelector(
  ".ribbon .general-information .read:not(.mobile)"
);
let mobileReadStatisticElement = document.querySelector(
  ".ribbon .general-information .read.mobile"
);
let desktopNotReadStatisticElement = document.querySelector(
  ".ribbon .general-information .not-read:not(.mobile)"
);
let mobileNotReadStatisticElement = document.querySelector(
  ".ribbon .general-information .not-read.mobile"
);
/* #endregion */
/* #region  highlight funcions */
function highlightCards(
  cardCheck,
  highlightType
) /* cardCheck can be either: all, read or not read */ {
  let allCards = document.querySelectorAll(".books .card");
  function highlightCard(card) {
    if (highlightType === "static") card.classList.add("highlight");
    else if (highlightType === "hover") card.classList.add("hover-highlight");
  }
  function checkForValidCard(card) {
    let cardReadData = card.querySelector(".read-data");
    if (
      (cardReadData.textContent === "Finished" && cardCheck === "read") ||
      (cardReadData.textContent === "In progress" &&
        cardCheck === "not read") ||
      cardCheck === "all"
    )
      highlightCard(card);
  }
  allCards.forEach((card) => checkForValidCard(card));
}
function unhighlightCards(
  cardCheck,
  highlightType
) /* cardCheck can be either: all, read or not read */ {
  let allCards = document.querySelectorAll(".books .card");
  function unhighlightCard(card) {
    if (highlightType === "static") card.classList.remove("highlight");
    else if (highlightType === "hover")
      card.classList.remove("hover-highlight");
  }
  function checkForValidCard(card) {
    let cardReadData = card.querySelector(".read-data");
    if (
      (cardReadData.textContent === "Finished" && cardCheck === "read") ||
      (cardReadData.textContent === "In progress" &&
        cardCheck === "not read") ||
      cardCheck === "all"
    )
      unhighlightCard(card);
  }
  allCards.forEach((card) => checkForValidCard(card));
}
function markAsHighlighting(statisticElement, highlightType) {
  if (highlightType === "static")
    statisticElement.classList.add("highlighting");
  else if (highlightType === "hover")
    statisticElement.classList.add("hover-highlighting");
  if (statisticElement.textContent.slice(0, 5) === "Total")
    highlightCards("all", highlightType);
  if (statisticElement.textContent.slice(0, 4) === "Read")
    highlightCards("read", highlightType);
  if (statisticElement.textContent.slice(0, 3) === "Not")
    highlightCards("not read", highlightType);
}
function unmarkAsHighlighting(statisticElement, highlightType) {
  if (highlightType === "static")
    statisticElement.classList.remove("highlighting");
  else if (highlightType === "hover")
    statisticElement.classList.remove("hover-highlighting");
  if (statisticElement.textContent.slice(0, 5) === "Total")
    unhighlightCards("all", highlightType);
  if (statisticElement.textContent.slice(0, 4) === "Read")
    unhighlightCards("read", highlightType);
  if (statisticElement.textContent.slice(0, 3) === "Not")
    unhighlightCards("not read", highlightType);
}
function computeHighlightWhenTurningOn(
  typeOfCards,
  highlightType
) /* again, value can be all, read or not read */ {
  let highlightingTypeClass =
    highlightType === "static"
      ? "highlighting"
      : highlightType === "hover"
      ? "hover-highlighting"
      : "wtf is this bro";
  if (typeOfCards === "all") {
    unmarkAsHighlighting(desktopReadStatisticElement, highlightType);
    unmarkAsHighlighting(mobileReadStatisticElement, highlightType);
    unmarkAsHighlighting(desktopNotReadStatisticElement, highlightType);
    unmarkAsHighlighting(mobileNotReadStatisticElement, highlightType);
    markAsHighlighting(desktopTotalStatisticElement, highlightType);
    markAsHighlighting(mobileTotalStatisticElement, highlightType);
  }
  if (typeOfCards === "read") {
    if (
      desktopNotReadStatisticElement.classList.contains(
        highlightingTypeClass
      ) ||
      mobileNotReadStatisticElement.classList.contains(highlightingTypeClass)
    )
      computeHighlightWhenTurningOn("all", highlightType);
    else {
      unmarkAsHighlighting(desktopTotalStatisticElement, highlightType);
      unmarkAsHighlighting(mobileTotalStatisticElement, highlightType);
      markAsHighlighting(desktopReadStatisticElement, highlightType);
      markAsHighlighting(mobileReadStatisticElement, highlightType);
    }
  } else if (typeOfCards === "not read") {
    if (
      desktopReadStatisticElement.classList.contains(highlightingTypeClass) ||
      mobileReadStatisticElement.classList.contains(highlightingTypeClass)
    )
      computeHighlightWhenTurningOn("all", highlightType);
    else {
      unmarkAsHighlighting(desktopTotalStatisticElement, highlightType);
      unmarkAsHighlighting(mobileTotalStatisticElement, highlightType);
      markAsHighlighting(desktopNotReadStatisticElement, highlightType);
      markAsHighlighting(mobileNotReadStatisticElement, highlightType);
    }
  }
}
function computeHighlightWhenTurningOff(
  typeOfCards,
  highlightType
) /* again, value can be all, read or not read */ {
  if (typeOfCards === "all") {
    unmarkAsHighlighting(desktopTotalStatisticElement, highlightType);
    unmarkAsHighlighting(mobileTotalStatisticElement, highlightType);
    unmarkAsHighlighting(desktopReadStatisticElement, highlightType);
    unmarkAsHighlighting(mobileReadStatisticElement, highlightType);
    unmarkAsHighlighting(desktopNotReadStatisticElement, highlightType);
    unmarkAsHighlighting(mobileNotReadStatisticElement, highlightType);
  }
  if (typeOfCards === "read") {
    unmarkAsHighlighting(desktopReadStatisticElement, highlightType);
    unmarkAsHighlighting(mobileReadStatisticElement, highlightType);
  } else if (typeOfCards === "not read") {
    unmarkAsHighlighting(desktopNotReadStatisticElement, highlightType);
    unmarkAsHighlighting(mobileNotReadStatisticElement, highlightType);
  }
}
function computeHighlight(event, highlightType) {
  let highlightingTypeClass =
    highlightType === "static"
      ? "highlighting"
      : highlightType === "hover"
      ? "hover-highlighting"
      : "wtf is this bro";
  let targetedStatisticElement = event.target;
  if (targetedStatisticElement.classList.contains(highlightingTypeClass)) {
    if (targetedStatisticElement.textContent.slice(0, 5) === "Total")
      computeHighlightWhenTurningOff("all", highlightType);
    else if (targetedStatisticElement.textContent.slice(0, 4) === "Read")
      computeHighlightWhenTurningOff("read", highlightType);
    else if (targetedStatisticElement.textContent.slice(0, 3) === "Not")
      computeHighlightWhenTurningOff("not read", highlightType);
  } else {
    if (targetedStatisticElement.textContent.slice(0, 5) === "Total")
      computeHighlightWhenTurningOn("all", highlightType);
    else if (targetedStatisticElement.textContent.slice(0, 4) === "Read")
      computeHighlightWhenTurningOn("read", highlightType);
    else if (targetedStatisticElement.textContent.slice(0, 3) === "Not")
      computeHighlightWhenTurningOn("not read", highlightType);
  }
}
/* #endregion */
/* #region  add highlight click listeners */
desktopTotalStatisticElement.addEventListener("click", staticComputeHighlight);
desktopReadStatisticElement.addEventListener("click", staticComputeHighlight);
desktopNotReadStatisticElement.addEventListener(
  "click",
  staticComputeHighlight
);
/* #endregion */

function staticComputeHighlight(event) {
  computeHighlight(event, "static");
}
function hoverComputeHighlight(event) {
  computeHighlight(event, "hover");
}
/* #region  add highlight hover listeners */
desktopTotalStatisticElement.addEventListener(
  "mouseover",
  hoverComputeHighlight
);
desktopTotalStatisticElement.addEventListener(
  "mouseleave",
  hoverComputeHighlight
);
desktopReadStatisticElement.addEventListener(
  "mouseover",
  hoverComputeHighlight
);
desktopReadStatisticElement.addEventListener(
  "mouseleave",
  hoverComputeHighlight
);
desktopNotReadStatisticElement.addEventListener(
  "mouseover",
  hoverComputeHighlight
);
desktopNotReadStatisticElement.addEventListener(
  "mouseleave",
  hoverComputeHighlight
);
/* #endregion */
/* #endregion */
/* #region  reload functions */
function reloadHighlights() {
  if (desktopTotalStatisticElement.classList.contains("highlighting")) {
    unmarkAsHighlighting(desktopTotalStatisticElement, "static");
    markAsHighlighting(desktopTotalStatisticElement, "static");
  } else if (desktopReadStatisticElement.classList.contains("highlighting")) {
    unmarkAsHighlighting(desktopReadStatisticElement, "static");
    unmarkAsHighlighting(
      desktopTotalStatisticElement,
      "static"
    ); /* remove all elements highlight */
    markAsHighlighting(desktopReadStatisticElement, "static");
  } else if (
    desktopNotReadStatisticElement.classList.contains("highlighting")
  ) {
    unmarkAsHighlighting(desktopNotReadStatisticElement, "static");
    unmarkAsHighlighting(
      desktopTotalStatisticElement,
      "static"
    ); /* remove all elements highlight */
    markAsHighlighting(desktopNotReadStatisticElement, "static");
  }
}
function reloadStatistics() {
  let allBooks = document.querySelectorAll(".books .card");
  let finishedBooks = document.querySelectorAll(".books .card.finished");
  desktopTotalStatisticElement.textContent =
    mobileTotalStatisticElement.textContent = "Total: " + allBooks.length;
  desktopReadStatisticElement.textContent =
    mobileReadStatisticElement.textContent = "Read: " + finishedBooks.length;
  desktopNotReadStatisticElement.textContent =
    mobileNotReadStatisticElement.textContent =
      "Not read: " + (allBooks.length - finishedBooks.length);
}
/* #endregion */
/* #region  open library cover and search api functions */
function findOpenLibraryCoverKey(bookElement, title, author) {
  if (title === "") title = '""';
  let searchURL = "https://openlibrary.org/search.json?title=" + title;
  if (author) searchURL += "&author=" + author;
  fetch(searchURL)
    .then((a) => a.json())
    .then((response) => {
      if (response.numFound === 0)
        findOpenLibraryCoverKey(bookElement, title, "");
      for (let index = 0; index < response.numFound; index++) {
        let testedKey = response.docs[index].cover_edition_key;
        if (testedKey) {
          loadOpenLibraryCover(bookElement, testedKey);
          return;
        }
      }
    });
}
function loadOpenLibraryCover(book, key) {
  let coverElement = book.querySelector(".book-cover");
  let openLibraryCoverURL = `https://covers.openlibrary.org/b/olid/${key}-L.jpg`;
  coverElement.style.backgroundImage = `url(${openLibraryCoverURL})`;
}
function setOpenLibraryBookCover(book, bookData) {
  findOpenLibraryCoverKey(book, bookData.title, bookData.author);
}
/* #endregion */
/* #endregion */
function Book(title, author, numberOfPages, isFinished) {
  this.title = title;
  this.author = author;
  this.numberOfPages = numberOfPages;
  this.isFinished = isFinished;
}
let bookDataArr = [];
let currentDefaultCoverNumber = 0,
  totalNumberOfDefaultCovers = 11;
addPopupListeners();
setAllInitialBooks();
