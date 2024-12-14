const { Role } = require('../models');

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.create({ name, description });
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const updateRole = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const member = await Member.findByPk(id);
  
      if (!member) return res.status(404).json({ error: 'Member not found' });
  
      await member.update(updates);
      res.json(member);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

const deleteRole = async (req, res) => {
    try {
      const { id } = req.params;
      const member = await Member.findByPk(id);
  
      if (!member) return res.status(404).json({ error: 'Member not found' });
  
      await member.destroy();
      res.json({ message: 'Member deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  module.exports = { getRoles, createRole, updateRole, deleteRole };
  
