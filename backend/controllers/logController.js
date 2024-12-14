const { Log, Member, User } = require('../models'); // assuming Log model is in models directory



const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['username', 'email', 'userId'], // Include userId from the Member model
          include: {
            model: User, // Assuming there's a User model
            as: 'user', // Alias for the User association
            attributes: ['username'], // Only include the username from the User model
          },
        },
      ],
      order: [['createdAt', 'DESC']], // Sort by createdAt in descending order
    });

    res.status(200).json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};




module.exports = {  getAllLogs };
