const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  membershipId: { type: String, required: true, unique: true },
  membershipType: { type: String, enum: ['Student', 'Teacher', 'Regular', 'Premium'], default: 'Regular' },
  joinedDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BorrowedBook' }],
  fines: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);