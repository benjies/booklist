// Classes
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    // Add Book
    addBookToList(book){
        const list = document.getElementById('book-list');
        // Create tr element
        const row = document.createElement('tr');
        // Insert col
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;
        // Append
        list.appendChild(row);
    }
    // Show Alert
    showAlert(message, className){
        // Create div
        const div = document.createElement('div');
        // Add class
        div.className = `alert ${className}`;
        // Add text node
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        // Get form
        const form = document.querySelector('#book-form');
        // Insert Alert
        container.insertBefore(div, form);
        // Timeout Alert 3s
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }
    // Delete Book
    deleteBook(target) {
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }
    // Clear Fields
    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Locale Storage Class
class Store {
    // Fetch book from locale
    static getBooks(){
        let books;
        if(localStorage.getItem('books')=== null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    // Display Book
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI;
            // Add Book to UI
            ui.addBookToList(book);
        });
    }
    // Add Book to Locale
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    // Remove book from locale
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach(function(book, index) {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event listener ADD BOOK
document.getElementById('book-form').addEventListener('submit', function(e){
    // Get form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;
    // Instantiate Book
    const book = new Book(title, author, isbn);
    // Instantiate UI 
    const ui = new UI();
    // Validate Fields
    if(title === '' || author === '' || isbn === ''){
        // Error Alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
            // Success Alert
            ui.showAlert('Book added successfully', 'success');
            // Add book to list
             ui.addBookToList(book);
            //  Add to Locale Storage
            Store.addBook(book);

             // Clear Fieds
              ui.clearFields();
    }

    e.preventDefault();
});

// Event Listener REMOVE BOOK
document.getElementById('book-list').addEventListener('click', function(e){
    // Instantiate UI 
    const ui = new UI();
    // Delete Book
    ui.deleteBook(e.target);
    // Remove From Locale Storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Show Alert
    ui.showAlert('Book removed successfully', 'success');

    e.preventDefault();
});