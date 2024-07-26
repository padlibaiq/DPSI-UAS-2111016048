const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');
const secretKey = process.env.SECRET_KEY || 'baiq_123';

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).send('Token is required');

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).send('Token is required');
    
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        if (decoded.userType !== 'admin') return res.status(403).send('Access denied');
        req.userId = decoded.userId;
        next();
    });
};

// Add a new book
router.post('/add', verifyAdminToken, async (req, res) => {
    try {
        const { bookId, title, author, ISBN, genre, quantity } = req.body;
        const newBook = new Book({ bookId, title, author, ISBN, genre, quantity });
        await newBook.save();
        res.status(201).send('Book added successfully');
    } catch (err) {
        res.status(500).send('Failed to add book');
    }
});

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).send('Failed to retrieve books');
    }
});

// Update book details
router.put('/update/:bookId', verifyAdminToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        const { title, author, ISBN, genre, quantity } = req.body;
        
        const updatedBook = await Book.findOneAndUpdate(
            { bookId },
            { title, author, ISBN, genre, quantity },
            { new: true }
        );
        if (!updatedBook) return res.status(404).send('Book not found');
        res.status(200).send('Book updated successfully');
    } catch (err) {
        res.status(500).send('Failed to update book');
    }
});

// Delete a book
router.delete('/delete/:bookId', verifyAdminToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        const deletedBook = await Book.findOneAndDelete({ bookId });
        if (!deletedBook) return res.status(404).send('Book not found');
        res.status(200).send('Book deleted successfully');
    } catch (err) {
        res.status(500).send('Failed to delete book');
    }
});

module.exports = router;
