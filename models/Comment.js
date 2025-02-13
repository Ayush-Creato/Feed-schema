const mongoose = require('mongoose');

// Comment schema
const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
commentSchema.index({ reel: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema); 