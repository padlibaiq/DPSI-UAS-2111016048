const User = require('./User');
const Student = require('./Student');
const Book = require('./Book');
const BorrowRecord = require('./BorrowRecord');

class LibrarySystem {
    constructor() {
        this.users = [];
        this.books = [];
        this.borrowRecords = [];
    }

    static instance() {
        if (!LibrarySystem._instance) {
            LibrarySystem._instance = new LibrarySystem();
        }
        return LibrarySystem._instance;
    }

    registerUser(user) {
        const existingUser = this.users.find(u => u.email === user.email);
        if (existingUser) {
            return false; // User already exists
        }
        this.users.push(user);
        return true;
    }

    loginUser(email, password) {
        const user = this.users.find(u => u.email === email);
        if (user && User.validatePassword(password, user.password)) {
            return user;
        }
        return null;
    }

    loginStudent(email, password) {
        const student = this.users.find(u => u.email === email && u instanceof Student);
        if (student && Student.validatePassword(password, student.password)) {
            return student;
        }
        return null;
    }

    addBook(book) {
        this.books.push(book);
    }

    getBooks() {
        return this.books;
    }

    getUser(userId) {
        return this.users.find(u => u.userId === userId);
    }
}

module.exports = LibrarySystem.instance();
