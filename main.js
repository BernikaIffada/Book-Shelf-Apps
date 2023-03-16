const books = [];
const RENDER_EVENT = 'render-book';
 
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
 
function addBook() {
    const titleInput = document.getElementById("inputBookTitle").value;
    const authorInput = document.getElementById("inputBookAuthor").value;
    const yearInput = document.getElementById("inputBookYear").value;
    const isCompleted= document.getElementById("inputBookIsComplete").checked;

 
   const generatedID = generatId();
    const bookObject = generateBookObject(generatedID, titleInput, authorInput, yearInput, isCompleted);
    books.push(bookObject);
 
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
  }
 
function generatId() {
    return +new Date();
}
 
function generateBookObject(id, titleInput, authorInput, yearInput, isCompleted) {
    return {
        id,
        titleInput,
        authorInput,
        yearInput,
        isCompleted
    }
}
 
document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';
 
 
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted) {
      incompleteBookshelfList.append(bookElement);
      } else { 
      completeBookshelfList.append(bookElement);
    }
    }
  });
 
function makeBook(bookObject) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = bookObject.titleInput;
 
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = bookObject.authorInput;
 
    const bookYear = document.createElement("p");
    bookYear.innerText = bookObject.yearInput;
 
    const bookAction = document.createElement("div");
    bookAction.classList.add("action");
 
    const book = document.createElement("article");
    book.classList.add("book_item");
    book.append(bookTitle, bookAuthor, bookYear, bookAction);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(book);
    container.setAttribute('id', `book-${bookObject.id}`);
 
    if (bookObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.innerText = "Baca Kembali";
      undoButton.classList.add('undo-button');
 
      undoButton.addEventListener('click', function () {
        undoListFromCompleted(bookObject.id);
      }); 
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.innerText = "Hapus Buku";

 
      trashButton.addEventListener('click', function () {
        removeListFromCompleted(bookObject.id);
      }); 

      bookAction.append(undoButton);
      bookAction.append(trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.innerText = "Selesai dibaca";
      checkButton.classList.add('check-button');
 
      checkButton.addEventListener('click', function() {
        addListToCompleted(bookObject.id);
      }); 
      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');
      trashButton.innerText = "Hapus Buku";

 
      trashButton.addEventListener('click', function () {
        removeListFromCompleted(bookObject.id);
      }); 
      bookAction.append(checkButton);
      bookAction.append(trashButton);
    }
    container.append(bookAction);
    return container;
  } 
 
function removeListFromCompleted (bookId) {
      const bookTarget = findBookIndex(bookId);
      if (bookTarget === -1) return;
 
      books.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
 
function undoListFromCompleted(bookId) {
      const bookTarget = findBook(bookId);
 
      if (bookTarget == null) return;
 
      bookTarget.isCompleted = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
    }
 
 
function addListToCompleted (bookId) {
    const bookTarget = findBook(bookId);
 
    if (bookTarget == null) return;
 
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  } 
 
function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
      return bookItem;
    }
  }
    return null;
  }
  
function findBookIndex(bookId) {
    for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
    return -1;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'bookshelf-apps';

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser tidak mendukung local storage');
      return false;
    }
    return true;
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  })

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
      }

  document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item > h3');
    for (const book of bookList) {
      if (book.innerText.toLowerCase().includes(searchBook)) {
        book.parentElement.style.display = 'block';
      } else {
        book.parentElement.style.display = 'none';
      }
    }
  });
