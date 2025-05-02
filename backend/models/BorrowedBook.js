const mongoose = require('mongoose');

const borrowedBookSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Librarian who processed
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  renewalCount: { type: Number, default: 0 },
  fine: { type: Number, default: 0 },
  status: { type: String, enum: ['Borrowed', 'Returned', 'Overdue', 'Lost'], default: 'Borrowed' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BorrowedBook', borrowedBookSchema);