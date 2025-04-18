require('dotenv').config(); // Load environment variables

// External dependencies
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Internal imports
const { sequelize, User } = require('./models');

// App setup
const app = express();
const PORT = process.env.PORT || 3000;

// Check for required env vars
if (!process.env.JWT_SECRET_KEY) {
    console.error('❌ JWT_SECRET_KEY is not defined in the environment.');
    process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));

// Database sync
sequelize.sync()
    .then(() => console.log('✅ Database synced successfully'))
    .catch((err) => console.error('❌ Database sync error:', err));

// Health check
app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is healthy', time: new Date() });
});

// Create a new user
app.post('/api/create-user', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const [newUser, created] = await User.findOrCreate({
            where: { username },
            defaults: { password: await bcrypt.hash(password, 10) },
        });

        if (!created) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }

        return res.status(201).json({ message: 'User created successfully!', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Error creating user.' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error during login.' });
    }
});

// JWT auth middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access denied, no token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = user;
        next();
    });
}

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You have access to this route', user: req.user });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
