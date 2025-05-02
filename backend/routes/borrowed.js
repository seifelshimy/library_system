const express = require('express');
const router = express.Router();
const BorrowedBook = require('../models/BorrowedBook');
const Book = require('../models/Book');
const Member = require('../models/Member');
const auth = require('../middleware/auth');

// Get all borrowed books with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { memberId, status, overdue, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (memberId) filter.memberId = memberId;
    if (status) filter.status = status;
    
    // Handle overdue filter
    if (overdue === 'true') {
      filter.dueDate = { $lt: new Date() };
      filter.status = 'Borrowed'; // Only borrowed books can be overdue
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with population
    const borrowedBooks = await BorrowedBook.find(filter)
      .populate('bookId', 'title author isbn coverUrl')
      .populate('memberId', 'name email membershipId')
      .populate('userId', 'name')
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Count total documents for pagination info
    const total = await BorrowedBook.countDocuments(filter);
    
    res.json({
      borrowedBooks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single borrowed book record
router.get('/:id', auth, async (req, res) => {
  try {
    const borrowedBook = await BorrowedBook.findById(req.params.id)
      .populate('bookId')
      .populate('memberId')
      .populate('userId', 'name');
      
    if (!borrowedBook) {
      return res.status(404).json({ message: 'Borrowed book record not found' });
    }
    
    res.json(borrowedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Issue a book to a member
router.post('/', auth, async (req, res) => {
  try {
    // Only librarians and admins can issue books
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      return res.status(403).json({ message: 'Unauthorized: Requires admin or librarian role' });
    }
    
    const { memberId, bookId, dueDate, notes } = req.body;
    
    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.availableQuantity < 1) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }
    
    // Check if member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    // Check if member has an active status
    if (member.status !== 'Active') {
      return res.status(400).json({ message: 'Member is not active' });
    }
    
    // Create borrowed book record
    const borrowedBook = new BorrowedBook({
      memberId,
      bookId,
      userId: req.user.id, // Librarian who is processing the transaction
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      status: 'Borrowed',
      notes
    });
    
    // Update book availability
    book.availableQuantity -= 1;
    if (book.availableQuantity === 0) {
      book.status = 'Borrowed';
    }
    
    // Add book to member's borrowed books array
    member.borrowedBooks.push(borrowedBook._id);
    
    // Save all changes in a transaction-like manner
    await Promise.all([
      borrowedBook.save(),
      book.save(),
      member.save()
    ]);
    
    res.status(201).json({
      message: 'Book issued successfully',
      borrowedBook: await BorrowedBook.findById(borrowedBook._id)
        .populate('bookId', 'title author isbn')
        .populate('memberId', 'name membershipId')
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Return a borrowed book
router.put('/:id/return', auth, async (req, res) => {
  try {
    // Only librarians and admins can return books
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      return res.status(403).json({ message: 'Unauthorized: Requires admin or librarian role' });
    }
    
    const { fine, notes } = req.body;
    
    // Find the borrowed book record
    const borrowedBook = await BorrowedBook.findById(req.params.id);
    if (!borrowedBook) {
      return res.status(404).json({ message: 'Borrowed book record not found' });
    }
    
    // Check if book is already returned
    if (borrowedBook.status === 'Returned') {
      return res.status(400).json({ message: 'Book is already returned' });
    }
    
    // Update borrowed book record
    borrowedBook.returnDate = new Date();
    borrowedBook.status = 'Returned';
    if (fine) borrowedBook.fine = fine;
    if (notes) borrowedBook.notes = notes;
    
    // Update book availability
    const book = await Book.findById(borrowedBook.bookId);
    book.availableQuantity += 1;
    if (book.status === 'Borrowed') {
      book.status = 'Available';
    }
    
    // Update member's borrowed books
    const member = await Member.findById(borrowedBook.memberId);
    if (member) {
      member.borrowedBooks = member.borrowedBooks.filter(
        id => id.toString() !== borrowedBook._id.toString()
      );
      
      // Add fine to member's account if applicable
      if (fine && fine > 0) {
        member.fines += parseFloat(fine);
      }
      
      await member.save();
    }
    
    // Save changes
    await Promise.all([
      borrowedBook.save(),
      book.save()
    ]);
    
    res.json({
      message: 'Book returned successfully',
      borrowedBook: await BorrowedBook.findById(borrowedBook._id)
        .populate('bookId', 'title author isbn')
        .populate('memberId', 'name membershipId')
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Renew a borrowed book
router.put('/:id/renew', auth, async (req, res) => {
  try {
    // Only librarians and admins can renew books
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      return res.status(403).json({ message: 'Unauthorized: Requires admin or librarian role' });
    }
    
    const { newDueDate, notes } = req.body;
    
    // Find the borrowed book record
    const borrowedBook = await BorrowedBook.findById(req.params.id);
    if (!borrowedBook) {
      return res.status(404).json({ message: 'Borrowed book record not found' });
    }
    
    // Check if book is eligible for renewal
    if (borrowedBook.status !== 'Borrowed') {
      return res.status(400).json({ message: 'Only borrowed books can be renewed' });
    }
    
    // Check renewal limit (typically libraries allow 1-3 renewals)
    if (borrowedBook.renewalCount >= 3) {
      return res.status(400).json({ message: 'Maximum renewal limit reached' });
    }
    
    // Update borrowed book record
    borrowedBook.dueDate = new Date(newDueDate);
    borrowedBook.renewalCount += 1;
    if (notes) borrowedBook.notes = `${borrowedBook.notes ? borrowedBook.notes + ' | ' : ''}Renewed: ${notes}`;
    
    await borrowedBook.save();
    
    res.json({
      message: 'Book renewed successfully',
      borrowedBook: await BorrowedBook.findById(borrowedBook._id)
        .populate('bookId', 'title author isbn')
        .populate('memberId', 'name membershipId')
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get borrowing statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalBorrowed = await BorrowedBook.countDocuments({ status: 'Borrowed' });
    const totalReturned = await BorrowedBook.countDocuments({ status: 'Returned' });
    const totalOverdue = await BorrowedBook.countDocuments({
      status: 'Borrowed',
      dueDate: { $lt: new Date() }
    });
    
    // Most borrowed books
    const popularBooks = await BorrowedBook.aggregate([
      { $group: { _id: '$bookId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      { $unwind: '$bookDetails' },
      { $project: {
          _id: 1,
          count: 1,
          title: '$bookDetails.title',
          author: '$bookDetails.author'
        }
      }
    ]);
    
    res.json({
      totalBorrowed,
      totalReturned,
      totalOverdue,
      popularBooks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;