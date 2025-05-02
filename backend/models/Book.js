const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  publisher: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  pages: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  availableQuantity: { type: Number, required: true, default: 1 },
  coverUrl: { type: String, default: 'https://placehold.co/400x600?text=No+Cover' },
  location: { type: String, required: true }, // Shelf or section in the library
  status: { type: String, enum: ['Available', 'Borrowed', 'Reserved', 'Maintenance'], default: 'Available' },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);