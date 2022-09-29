//BUTTON
const btnDushboard = document.getElementById('btn-dashboard');
btnDushboard.addEventListener('click', () => {
  btnDushboard.classList.add('clicked');
  setTimeout(() => {
    btnDushboard.classList.remove('clicked');
  }, 300);
  const dashboard = document.getElementById('dashboard');
  dashboard.classList.toggle('show');
  if (dashboard.classList.contains('show')) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = 'auto';
  }
});
const btnAdd = document.getElementById('btn-add');
btnAdd.addEventListener('click', () => {
  btnAdd.classList.add('clicked');
  setTimeout(() => {
    btnAdd.classList.remove('clicked');
  }, 300);
});
const btnSearch = document.getElementById('btn-search');
btnSearch.addEventListener('click', () => {
  btnSearch.classList.add('clicked');
  setTimeout(() => {
    btnSearch.classList.remove('clicked');
  }, 300);
});
const btnSearchToggle = document.getElementById('btn-search-toggle');
btnSearchToggle.addEventListener('click', () => {
  btnSearchToggle.classList.toggle('active');
  searchBox.classList.toggle('show');
  renderVisualization(bookList);
  searchBox.reset();
});

// Load Data
window.addEventListener('DOMContentLoaded', () => {
    loadDataFromStorage();
    renderVisualization(bookList);
    setDashboard();
    setMaxYear();
  });
  // Dashboard
  const dashboard = document.getElementById('dashboard');
  const body = document.querySelector('body');
  dashboard.addEventListener('click', (ev) => {
    if (ev.target.closest('.dashboard-content')) return;
    dashboard.classList.remove('show');
    body.style.overflow = 'auto';
  });

  const popupWrapper = document.getElementById('popup-wrapper');
  btnAdd.addEventListener('click', () => {
    popupWrapper.classList.add('show');
    body.style.overflow = 'hidden';
  });
  popupWrapper.addEventListener('click', (ev) => {
    if (ev.target.closest('.popup-form')) return;
    popupWrapper.classList.remove('show');
    body.style.overflow = 'auto';
  });
  const bookForm = document.getElementById('book-form');
  bookForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    addBook();
    popupWrapper.classList.remove('show');
    body.style.overflow = 'auto';
    bookForm.reset();
  });
  // Edit Popup Form
  const editPopupWrapper = document.getElementById('edit-popup-wrapper');
  editPopupWrapper.addEventListener('click', (ev) => {
    if (ev.target.closest('.popup-form')) return;
    editPopupWrapper.classList.remove('show');
    body.style.overflow = 'auto';
  });
  // Search
  const searchBox = document.getElementById('search-box');
  searchBox.addEventListener('submit', (ev) => {
    ev.preventDefault();
  });
  const txtSearch = document.getElementById('txt-search');
  txtSearch.addEventListener('input', () => {
    const search = txtSearch.value;
    searchBookList(search);
  });
  
  // ACTION
  function addBook() {
    const message = 'added';
    const bookTitle = document.getElementById('txt-book-title').value;
    const bookAuthor = document.getElementById('txt-book-author').value;
    const bookYear = document.getElementById('num-book-year').value;
    const bookStatus = document.getElementById('check-book-status').checked;
    const bookId = generateId();
    const bookObject = composeBookObject(bookId, bookTitle, bookAuthor, bookYear, bookStatus);
  
    bookList.push(bookObject);
    renderVisualization(bookList);
    updateDataStorage(message);
    setDashboard();
    searchBox.reset();
  }
  function markComplete(bookId) {
    const message = 'marked read';
    const bookTarget = findBook(bookId);
    if (bookTarget === null) return;
    bookTarget.isComplete = true;
  
    renderVisualization(bookList);
    updateDataStorage(message);
    setDashboard();
    searchBox.reset();
  }
  function undoMarkComplete(bookId) {
    const message = 'marked unread';
    const bookTarget = findBook(bookId);
    if (bookTarget === null) return;
    bookTarget.isComplete = false;
  
    renderVisualization(bookList);
    updateDataStorage(message);
    setDashboard();
    searchBox.reset();
  }
  function removeBook(bookId) {
    const message = 'removed';
    const bookTargetIndex = findBookIndex(bookId);
    if (bookTargetIndex === -1) return;
    bookList.splice(bookTargetIndex, 1);
    alert(message)
    renderVisualization(bookList);
    updateDataStorage(message);
    setDashboard();
    searchBox.reset();
  }
  function editBook(bookTarget) {
    const message = 'edited';
    const bookTitle = document.getElementById('txt-edit-book-title').value;
    const bookAuthor = document.getElementById('txt-edit-book-author').value;
    const bookYear = document.getElementById('num-edit-book-year').value;
    const bookStatus = document.getElementById('check-edit-book-status').checked;
    const bookId = bookTarget.id;
    const bookObject = composeBookObject(bookId, bookTitle, bookAuthor, bookYear, bookStatus);
  
    const bookTargetIndex = findBookIndex(bookTarget.id);
    if (bookTargetIndex === -1) return;
    bookList[bookTargetIndex] = bookObject;
  
    renderVisualization(bookList);
    updateDataStorage(message);
    setDashboard();
    searchBox.reset();
  }
  
  // VISUALIZATION
  function renderVisualization(bookList) {
    const unreadList = document.getElementById('unread-list');
    // unreadList.innerHTML = '';
    unreadList.innerHTML = '<p id="empty-unread" class="empty-text">No book, Add Book Please :)</p>';
    const readList = document.getElementById('read-list');
    // readList.innerHTML = '';
    readList.innerHTML = '<p id="empty-read" class="empty-text">No book, Please Finished a Book:)</p>';
  
    for (const book of bookList) {
      const listItemElement = createItemList(book);
      if (book.isComplete) {
        document.getElementById('empty-read').classList.add('hide');
        readList.append(listItemElement);
      } else {
        document.getElementById('empty-unread').classList.add('hide');
        unreadList.append(listItemElement);
      }
    }
  }
  
  // LIST ITEM ELEMENT
  function createItemList(book) {
    const textTitle = document.createElement('h3');
    textTitle.classList.add('text-title');
    textTitle.innerText = book.title;
    const textAuthor = document.createElement('p');
    textAuthor.classList.add('text-author');
    textAuthor.innerText = book.author;
    const textYear = document.createElement('p');
    textYear.classList.add('text-year');
    textYear.innerText = book.year;
  
    const contentItem = document.createElement('div');
    contentItem.classList.add('content-item');
    contentItem.setAttribute('id', `todo-${book.id}`)
    contentItem.append(textTitle, textAuthor, textYear);
  
    // Action Buttons
    const contentBtn = document.createElement('div');
    contentBtn.classList.add('content-btn')
  
    const btnEdit = document.createElement('button');
    btnEdit.setAttribute('id', 'btn-edit');
    btnEdit.classList.add('btn', 'btn-edit', 'fa-solid', 'fa-pen');
    btnEdit.addEventListener('click', () => {
      setEditForm(book.id)
    });
    const btnTrash = document.createElement('button');
    btnTrash.setAttribute('id', 'btn-trash');
    btnTrash.classList.add('btn', 'btn-trash', 'fa-solid', 'fa-trash');
    btnTrash.addEventListener('click', () => {
      if (confirm("Are you sure ?")) {
        removeBook(book.id)
      }
    });
  
    if (book.isComplete) {
      const btnUndo = document.createElement('button');
      btnUndo.setAttribute('id', 'btn-undo');
      btnUndo.classList.add('btn', 'btn-undo', 'fa-solid', 'fa-rotate-left');
      btnUndo.addEventListener('click', () => {
        undoMarkComplete(book.id)
      });
  
      contentBtn.append(btnUndo, btnEdit, btnTrash);
      contentItem.append(contentBtn);
    } else {
      const btnCheck = document.createElement('button');
      btnCheck.setAttribute('id', 'btn-check');
      btnCheck.classList.add('btn', 'btn-check', 'fa-solid', 'fa-check');
      btnCheck.addEventListener('click', () => {
        markComplete(book.id)
      });
  
      contentBtn.append(btnCheck, btnEdit, btnTrash);
      contentItem.append(contentBtn);
    }
    return contentItem;
  }
  
  // DASHBOARD
  function setDashboard() {
    const totalBook = document.getElementById('total-book');
    const totalRead = document.getElementById('total-read');
    const totalUnread = document.getElementById('total-unread');
  
    if (bookList.length == 0) return;
    totalBook.innerText = bookList.length;
  
    const bookRead = [];
    const bookUnread = [];
    for (book of bookList) {
      if (book.isComplete === true) {
        bookRead.push(book);
      } else {
        bookUnread.push(book);
      }
    }
    totalRead.innerText = bookRead.length;
    totalUnread.innerText = bookUnread.length;
  }
  
  // SEARCH
  function searchBookList(textSearch) {
    if (bookList.length === 0) return;
  
    if (textSearch === '') renderVisualization(bookList);
  
    const selectedBookList = [];
    for (const book of bookList) {
      const lowertextSearch = textSearch.toLowerCase();
      const textTarget = book.title.toLowerCase() + book.author.toLowerCase();
      if (textTarget.includes(lowertextSearch)) {
        selectedBookList.push(book);
      }
    }
    renderVisualization(selectedBookList);
  }
  
  // EDIT FORM
  function setEditForm(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget === null) return;
  
    document.getElementById('txt-edit-book-title').value = bookTarget.title;
    document.getElementById('txt-edit-book-author').value = bookTarget.author;
    document.getElementById('num-edit-book-year').value = bookTarget.year;
    document.getElementById('check-edit-book-status').checked = bookTarget.isComplete;
  
    editPopupWrapper.classList.add('show');
    body.style.overflow = 'hidden';
  
    const editBookForm = document.getElementById('edit-book-form');
    editBookForm.onsubmit = (ev) => {
      ev.preventDefault();
      editBook(bookTarget);
      editPopupWrapper.classList.remove('show');
      body.style.overflow = 'auto';
      editBookForm.reset();
    }
  }
  
  // TOAST
  function displayToast(message) {
    const toastMessage = document.createElement('div');
    toastMessage.setAttribute('id', 'toast-message');
    toastMessage.innerText = `${message} succesfully`;
    toastMessage.classList.add('toast-message');
    toastMessage.classList.add('show');
    const mainContent = document.getElementsByTagName('main')[0];
    mainContent.append(toastMessage);
  
    setTimeout(function () {
      toastMessage.classList.remove('show');
      document.getElementById('toast-message').remove();
    }, 2000);
  }
  
  function generateId() {
    return +new Date();
  }
  function findBook(bookId) {
    for (const book of bookList) {
      if (book.id === bookId) {
        return book;
      }
    }
    return null;
  }
  function findBookIndex(bookId) {
    return bookList.findIndex((book) => book.id === bookId);
  }
  function setMaxYear() {
    const currentYear = new Date().getUTCFullYear();
    const bookYear = document.getElementById('num-book-year');
    bookYear.setAttribute('max', currentYear.toString());
  }