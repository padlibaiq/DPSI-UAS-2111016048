const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, required: true },
    genre: { type: String, required: true },
    quantity: { type: Number, required: true },
    available: { type: Boolean, default: function() { return this.quantity > 0; } }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
