const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  media: {
    type:String
  },
  thumbnail: {
    type: String
  },
  caption: {
    type: String,
    trim: true
  },
  audio: {
    name: String,
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  views_count: {
    type: Number,
    default: 0
  },
  recommendations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recommendation',
  }],
  hashtags: [{
    type: String
  }],
  duration: {
    type: Number
  },
  video_quality: {
    type: String
  },
  share_count: {
    type: Number
  },
  play_count: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postsSchema);