// models/PortfolioItem.js
const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],  // Array to hold image URLs
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });  // This will automatically add createdAt and updatedAt fields

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);
module.exports = PortfolioItem;
