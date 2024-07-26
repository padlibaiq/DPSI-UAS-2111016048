const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const secretKey = process.env.SECRET_KEY || 'baiq_123';
const bcryptjs = require('bcryptjs');

// Middleware to verify student token
const verifyStudentToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).send('Token is required');

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).send('Token is required');
    
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        if (decoded.userType !== 'student') return res.status(403).send('Access denied');
        req.userId = decoded.userId;
        next();
    });
};

// Register a new student
router.post('/register', async (req, res) => {
    const { userId, name, email, password } = req.body;

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).send('Student already exists');
        }

        const newStudent = new Student({
            userId,
            name,
            email,
            password: bcryptjs.hashSync(password, 10)
        });

        await newStudent.save();
        res.status(201).send('Student registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to register student');
    }
});

// Login student
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await Student.findOne({ email });
        if (!student || !student.validatePassword(password)) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: student.userId, userType: 'student' }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Failed to login');
    }
});

// Borrow book
router.post('/borrow', verifyStudentToken, async (req, res) => {
    try {
        const { bookId, returnDate } = req.body;

        const book = await Book.findOne({ bookId });
        if (!book || book.quantity <= 0) {
            return res.status(404).send('Book not available');
        }

        const borrowRecord = new BorrowRecord({
            bookId,
            studentId: req.userId,
            returnDate
        });
        await borrowRecord.save();

        book.quantity -= 1;
        book.available = book.quantity > 0;
        await book.save();

        res.status(200).send('Book borrowed successfully');
    } catch (err) {
        res.status(500).send('Failed to borrow book');
    }
});

// Get all books
router.get('/books', verifyStudentToken, async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).send('Failed to retrieve books');
    }
});

module.exports = router;
