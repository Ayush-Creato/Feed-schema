const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  thumbnail: {
    type: String
  },
  caption: {
    type: String,
    trim: true
  },
  audio: {
    name: String,
    url: String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  }],
  recommendations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recommendation',
    required:true
  }],
  hashtags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postsSchema);