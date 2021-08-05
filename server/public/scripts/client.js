$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});


function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $(document).on('click', '#delete', deleteBook);
  $(document).on('click', '#readBtn', markAsRead);
  $(document).on('click', '#editBtn', editBook);
  $(document).on('click', '#unread', editBook);
  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// Delete the book
function deleteBook() {
  let id = $(this).closest('tr').data('id');
  $.ajax({
    url: `/books/${id}`,
    type: 'DELETE',
  }).then(function(response) {
    console.log(response);
    refreshBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}

// Mark the book as read
function markAsRead() {
  let isRead = "false";
  let id = $(this).closest('tr').data('id');
  isRead = $(this).closest('tr').data('is-red');

  if(isRead === true || isRead === null) {
    isRead = false;
  }

  $.ajax({
    url: `/books/${id}`,
    type: 'PUT',
    data: {isread: isRead}
  }).then(function(response) {
    console.log(response);
    refreshBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Edit the book
function editBook() {
  console.log($(this).closest('tr').data('id'));
  let id = $(this).closest('tr').data('id');
  isRead = $(this).closest('tr').data('is-red');
  console.log(isRead);
  console.log('got here');
  $.ajax({
    url: `/books/${id}`,
    type: 'PUT',
    data: {isread: isRead}
  }).then(function(response) {
    console.log(response);
    refreshBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
    checkIfRead(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}

/**
 * Check If Read
 */ 
function checkIfRead(books) {
  // for(let i = 0; i < books.length; i += 1) {
  //   let book = books[i];
  //   // For each book, append a new row to our table
  //   if(book.isRead === true) {
  //     $(this).closest('tr').css("backround", "yellow");
  //     console.log('is red', book);
  //     console.log(this);
  //   }
  //   console.log(book);
  // }
}

// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();
  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    let isRead = book.isRead;
    if(isRead === true) {
      $('#bookShelf').append(`
      <tr data-id=${book.id} data-is-red=${book.isRead} class="${'is-read-'+book.isRead}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td><button id="unread" class="btn btn-warning">Mark as Unread</button></td>
        <td><button id="editBtn" class="btn btn-success">Edit</button></td>
        <td><button id="delete" class="btn btn-danger">DELETE</button></td>
      </tr>
    `);
    } else {
      $('#bookShelf').append(`
      <tr data-id=${book.id} data-is-red=${book.isRead} class="${'is-read-'+book.isRead}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td><button id="readBtn" class="btn btn-primary">Mark as Read</button></td>
        <td><button id="editBtn" class="btn btn-success">Edit</button></td>
        <td><button id="delete" class="btn btn-danger">DELETE</button></td>
      </tr>
    `);
    }
  }
}
