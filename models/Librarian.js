const User = require('./User');
const LibrarySystem = require('./LibrarySystem'); // Import LibrarySystem

class Librarian extends User {
    constructor(userId, name, email, password) {
        super(userId, name, email, password, 'librarian');
    }

    addBook(book) {
        // Implementasi penambahan buku
        LibrarySystem.books.push(book); // Menambahkan buku ke LibrarySystem
        return true;
    }

    updateBook(book) {
        // Implementasi pembaruan buku
        const index = LibrarySystem.books.findIndex(b => b.bookId === book.bookId);
        if (index !== -1) {
            LibrarySystem.books[index] = book;
            return true;
        }
        return false;
    }

    deleteBook(bookId) {
        // Implementasi penghapusan buku
        const index = LibrarySystem.books.findIndex(b => b.bookId === parseInt(bookId));
        if (index !== -1) {
            LibrarySystem.books.splice(index, 1);
            return true;
        }
        return false;
    }

    getAllBooks() {
        return LibrarySystem.books; // Mengambil semua buku dari LibrarySystem
    }

    getBookById(bookId) {
        return LibrarySystem.books.find(book => book.bookId === parseInt(bookId));
    }
}

module.exports = Librarian;
