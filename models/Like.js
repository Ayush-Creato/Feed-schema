const mongoose = require('mongoose');

// Like schema
const likeSchema = new mongoose.Schema({
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index for faster queries and ensuring unique likes
likeSchema.index({ reel: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema); 