const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Member = require('../models/Member');
const BorrowedBook = require('../models/BorrowedBook');

router.get('/', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalMembers = await Member.countDocuments();
    const totalBorrowed = await BorrowedBook.countDocuments();
    res.json({ totalBooks, totalMembers, totalBorrowed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;