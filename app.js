//Book class: Represent a book 
class Book {
    constructor(title, author, isbn) {   //method that runs when u instantiate  a book
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//Ui class(As this is not going to be instantiated so static method )
class UI {
    static displayBooks() {


        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML =
            `<td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td><a href="#" class="btn btn-danger btn-sm-delete">X</a></td>`
            ;

        list.appendChild(row);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //remove the alert in 2s
        setTimeout(() => document.querySelector('.alert').remove(), 1500)
    }
    static deleteBook(element) {
        if (element.classList.contains('btn-sm-delete')) {
            element.parentElement.parentElement.remove();
        }

    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }
}



//store class
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
            //inside localstorage data is in string format so parsing converts that to object format
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));

    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


//Events to display a book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//events to add a book
document.querySelector("#book-form").addEventListener('submit', (e) => {

    //prevent default as it is a submit object
    e.preventDefault();
    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    //since it's an input we just want values not the complete element ^ the ones above

    //validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert("Please fill in all the fields", "danger");
    }
    else {
        //instantiate book
        const book = new Book(title, author, isbn);

        //adding book to ui
        UI.addBookToList(book);

        //Add book to store
        Store.addBook(book);
        //show success message
        UI.showAlert("Sucessfully added a book !!", "success");

        //Clear fields
        UI.clearFields();


    }



})

//events to remove a book
document.querySelector("#book-list").addEventListener('click', (e) => {
    //Remove book from ui
    UI.deleteBook(e.target);

    //Remove book from Store 
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //book remove message
    UI.showAlert("Book removed succesfully !!", 'info');
});