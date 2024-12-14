const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role, Log } = require('../models');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();
const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'mysecretkey';

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, roleId } = req.body;

        // Validate request body
        if (!username || !email || !password || !roleId) {
            return res.status(400).json({
                message: 'All fields (username, email, password, roleId) are required.',
            });
        }

        // Check if the username already exists
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        // Hash password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            roleId,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                roleId: user.roleId,
            },
        });
    } catch (err) {
        console.error('Error during user registration:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});


// User Login
router.post('/login', async (req, res) => {
    try {   
        const { username, email, password } = req.body;

        // Ensure required fields
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        if (!username && !email) {
            return res.status(400).json({ error: 'Username or email is required' });
        }

        // Find the user by username or email
        const user = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { username: username || null },
                    { email: email || null }
                ]
            },
            include: [{ model: Role, as: 'role' }]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.Role?.name },
            SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role.name,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});


module.exports = router;
