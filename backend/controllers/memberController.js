const { Member, User, Log } = require('../models');
const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { Op } = require('sequelize');



const uploadDirectory = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true }); // Create the directory if it doesn't exist
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the folder where profile pictures will be stored
    cb(null, '../uploads');
  },
  filename: (req, file, cb) => {
    // Set the filename as the current timestamp to avoid name conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with original file extension
  },
});

const upload = multer({ storage: storage }).single('profilePicture');

const getAllMembers = async (req, res) => {
  try {
    const { page = 1, pageSize = 5, searchTerm } = req.query;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    let whereOptions = {};

    if (searchTerm) {
      whereOptions = {
        $or: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { email: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
          { title: { [Op.like]: `%${searchTerm}%` } },
          { mobileNumber: { [Op.like]: `%${searchTerm}%` } }
        ]
      };
    }

    const members = await Member.findAndCountAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['username', 'email', 'roleId'],
        where: searchTerm ? { username: { [Op.like]: `%${searchTerm}%` } } : {}
      },
      where: whereOptions,
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      totalCount: members.count,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(members.count / pageSize),
      members: members.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
};




const getMemberByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const member = await Member.findOne({
      where: { userId },
      include: {
        model: User,
        as: 'user', // To include related user data
        attributes: ['username', 'email'], // Adjust these attributes as necessary
      },
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.status(200).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
};



const getTotalMemberCount = async (req, res) => {
  try {
    // Count the total number of members in the 'members' table
    const totalCount = await Member.count();

    // Respond with the total count
    res.status(200).json({ totalMembers: totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve member count' });
  }
};


const updateMember = async (req, res) => {
  const { userId } = req.params;
  const { bio, title, mobile } = req.body;

  try {
    // Handle file upload for profile picture
    await upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: 'Upload failed' });
      }

      // If file is uploaded, update the member with the new path
      if (req.file) {
        req.body.profilePicture = req.file.path;
      }

      // Find the member by userId
      const member = await Member.findOne({ where: { userId } });

      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }

      // Update the member fields
      member.bio = bio || member.bio;
      member.mobile = mobile || member.mobile;
      member.title = title || member.title;
      member.profilePicture = req.body.profilePicture || member.profilePicture;

      // Save the updated member record
      await member.save();

      // Create log entry 
      await Log.create({
        action: 'Profile Updated',
        details: `Member ${member.username} updated their profile.`,
        memberId: userId,
        username: member.username,
      });

      res.status(200).json({ message: 'Member updated successfully', member });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update member' });
  }
};
  


const deleteMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const member = await Member.findByPk(userId);

    if (!member) return res.status(404).json({ error: 'Member not found' });

    await member.destroy();
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAllMembers, updateMember, getMemberByUserId, upload, deleteMember, getTotalMemberCount };
