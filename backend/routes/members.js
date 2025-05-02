const express = require('express');
const Member = require('../models/Member');
const BorrowedBook = require('../models/BorrowedBook');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all members with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { 
      search, 
      membershipType, 
      status, 
      page = 1, 
      limit = 10, 
      sortBy = 'name', 
      sortOrder = 'asc' 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { membershipId: new RegExp(search, 'i') }
      ];
    }
    
    if (membershipType) filter.membershipType = membershipType;
    if (status) filter.status = status;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query
    const members = await Member.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Count total documents for pagination info
    const total = await Member.countDocuments(filter);
    
    res.json({
      members,
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

// Get a single member by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new member
router.post('/', auth, async (req, res) => {
  try {
    // Only librarians and admins can add members
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      return res.status(403).json({ message: 'Unauthorized: Requires admin or librarian role' });
    }
    
    const {
      name,
      email,
      phone,
      address,
      membershipType,
      expiryDate,
      notes
    } = req.body;
    
    // Check if member with email already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: 'Member with this email already exists' });
    }
    
    // Generate a unique membership ID
    const lastMember = await Member.findOne().sort({ createdAt: -1 });
    let membershipIdNum = 1000; // Start from 1000 if no members exist
    
    if (lastMember && lastMember.membershipId) {
      // Extract number from membership ID (e.g., "MEM1001" -> 1001)
      const match = lastMember.membershipId.match(/\d+/);
      if (match) {
        membershipIdNum = parseInt(match[0]) + 1;
      }
    }
    
    const membershipId = `MEM${membershipIdNum}`;
    
    // Create new member
    const member = new Member({
      name,
      email,
      phone,
      address,
      membershipId,
      membershipType: membershipType || 'Regular',
      joinedDate: new Date(),
      expiryDate: new Date(expiryDate),
      status: 'Active',
      borrowedBooks: [],
      fines: 0,
      notes
    });
    
    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a member
router.put('/:id', auth, async (req, res) => {
  try {
    // Only librarians and admins can update members
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      return res.status(403).json({ message: 'Unauthorized: Requires admin or librarian role' });
    }
    
    const {
      name,
      email,
      phone,
      address,
      membershipType,
      expiryDate,
      status,
      fines,
      notes
    } = req.body;
    
    // Find member
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    // Update fields
    if (name) member.name = name;
    if (email) member.email = email;
    if (phone) member.phone = phone;
    if (address) member.address = address;
    if (membershipType) member.membershipType = membershipType;
    if (expiryDate) member.expiryDate = new Date(expiryDate);
    if (status) member.status = status;
    if (fines !== undefined) member.fines = fines;
    if (notes) member.notes = notes;
    
    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a member
router.delete('/:id', auth, async (req, res) => {
  try {
    // Only admins can delete members
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Requires admin role' });
    }
    
    // Check if member has borrowed books
    const borrowedBooks = await BorrowedBook.find({ 
      memberId: req.params.id,
      status: 'Borrowed'
    });
    
    if (borrowedBooks.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete member with borrowed books. Please return all books first.'
      });
    }
    
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a member's borrowed books
router.get('/:id/borrowed-books', auth, async (req, res) => {
  try {
    const borrowedBooks = await BorrowedBook.find({
      memberId: req.params.id,
      status: 'Borrowed'
    }).populate('bookId');
    
    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pay fine
router.post('/:id/pay-fine', auth, async (req, res) => {
  try {
    // Only librarians and admins can process payments
    if (req.user.role !== 'admin' && req.user.role !== 'librarian') {
      return res.status(403).json({ message: 'Unauthorized: Requires admin or librarian role' });
    }
    
    const { amount, notes } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid payment amount' });
    }
    
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    if (member.fines < amount) {
      return res.status(400).json({ message: 'Payment amount exceeds outstanding fines' });
    }
    
    member.fines -= parseFloat(amount);
    
    if (notes) {
      member.notes = `${member.notes ? member.notes + ' | ' : ''}Fine payment: ${amount} - ${notes}`;
    }
    
    await member.save();
    
    res.json({
      message: 'Fine payment processed successfully',
      member: {
        id: member._id,
        name: member.name,
        fines: member.fines
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;