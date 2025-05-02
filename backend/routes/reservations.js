const express = require('express');
const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const Member = require('../models/Member');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all reservations with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { 
      memberId, 
      bookId, 
      status, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (memberId) filter.memberId = memberId;
    if (bookId) filter.bookId = bookId;
    if (status) filter.status = status;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with population
    const reservations = await Reservation.find(filter)
      .populate('bookId', 'title author isbn coverUrl')
      .populate('memberId', 'name email membershipId')
      .sort({ reservationDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Count total documents for pagination info
    const total = await Reservation.countDocuments(filter);
    
    res.json({
      reservations,
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

// Get a single reservation
router.get('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('bookId')
      .populate('memberId');
      
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new reservation
router.post('/', auth, async (req, res) => {
  try {
    const { memberId, bookId, expiryDate, notes } = req.body;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if book has available copies for reservation
    if (book.availableQuantity < 1) {
      book.status = 'Reserved';
    }
    
    // Check if member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    // Check if member is active
    if (member.status !== 'Active') {
      return res.status(400).json({ message: 'Member is not active' });
    }
    
    // Check if reservation already exists
    const existingReservation = await Reservation.findOne({
      memberId,
      bookId,
      status: 'Pending'
    });
    
    if (existingReservation) {
      return res.status(400).json({ message: 'Member already has an active reservation for this book' });
    }
    
    // Create reservation
    const reservation = new Reservation({
      memberId,
      bookId,
      reservationDate: new Date(),
      expiryDate: new Date(expiryDate || new Date().setDate(new Date().getDate() + 7)), // Default to 7 days
      status: 'Pending',
      notes
    });
    
    const savedReservation = await reservation.save();
    
    // Set book status to reserved if now fully booked
    if (book.availableQuantity === 0) {
      book.status = 'Reserved';
      await book.save();
    }
    
    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: await Reservation.findById(savedReservation._id)
        .populate('bookId', 'title author isbn')
        .populate('memberId', 'name membershipId')
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update reservation status
router.put('/:id', auth, async (req, res) => {
  try {
    // Only librarians and admins can update reservations
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      return res.status(403).json({ message: 'Unauthorized: Requires admin or librarian role' });
    }
    
    const { status, notes } = req.body;
    
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    // Update reservation
    reservation.status = status || reservation.status;
    
    if (notes) {
      reservation.notes = notes;
    }
    
    // Handle status changes
    if (status === 'Fulfilled') {
      // If fulfilled, set expiry date to now (no longer active)
      reservation.expiryDate = new Date();
    } else if (status === 'Cancelled') {
      // If cancelled, set expiry date to now
      reservation.expiryDate = new Date();
    }
    
    await reservation.save();
    
    res.json({
      message: 'Reservation updated successfully',
      reservation: await Reservation.findById(reservation._id)
        .populate('bookId', 'title author isbn')
        .populate('memberId', 'name membershipId')
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a reservation
router.delete('/:id', auth, async (req, res) => {
  try {
    // Only admins can delete reservations
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Requires admin role' });
    }
    
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Utility route to check current pending reservations for a book
router.get('/book/:bookId/pending', auth, async (req, res) => {
  try {
    const pendingReservations = await Reservation.find({
      bookId: req.params.bookId,
      status: 'Pending',
      expiryDate: { $gt: new Date() }
    }).populate('memberId', 'name email membershipId');
    
    res.json(pendingReservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 