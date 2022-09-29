const STORAGE_KEY = 'BOOKSHELF_APP';
const bookList = [];

function composeBookObject(id, title, author, year, isComplete) {
  return {
    id, title, author, year, isComplete
  }
}

function updateDataStorage(message) {
  if (isStorageSupported()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookList));
    displayToast(message);
  }
}

function loadDataFromStorage() {
  if (isStorageSupported()) {
    const appStorage = localStorage.getItem(STORAGE_KEY);
    if (appStorage !== null) {
      const bookData = JSON.parse(appStorage);
      for (const book of bookData) {
        bookList.push(book);
      }
    }
  }
}

// HELPER
function isStorageSupported() {
  if (typeof (Storage) === undefined) {
    alert('Your browser is not supported')
    return false;
  }
  return true;
}