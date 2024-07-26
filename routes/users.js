const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = process.env.SECRET_KEY || 'baiq_123';
const bcryptjs = require('bcryptjs');

// Register a new user
router.post('/register', async (req, res) => {
    const { userId, name, email, password, userType } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const newUser = new User({
            userId,
            name,
            email,
            password: bcryptjs.hashSync(password, 10),
            userType
        });

        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to register user');
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.validatePassword(password)) {
            return res.status(400).send('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.userId, userType: user.userType }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Failed to login');
    }
});

module.exports = router;
