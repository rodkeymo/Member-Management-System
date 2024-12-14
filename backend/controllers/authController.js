const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const register = async (req, res) => {
  try {
    const { username, email, password, roleId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId,
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, include: 'role' });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role.name }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login };
