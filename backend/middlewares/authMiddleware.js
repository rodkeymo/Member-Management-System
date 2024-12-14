const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const SECRET = process.env.JWT_SECRET || 'mysecretkey';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized access' });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
