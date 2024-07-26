const express = require('express');
const mongoose = require('mongoose');
const app = express();
const usersRouter = require('./routes/users');
const studentsRouter = require('./routes/students');
const booksRouter = require('./routes/books');
require('dotenv').config();

const port = 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/librarysystem';

// Middleware
app.use(express.json());

// Routes
app.use('/users', usersRouter);
app.use('/students', studentsRouter);
app.use('/books', booksRouter);

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
