const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }],
  recommendations: [{
    type: String,
    required: true
  }]
}, { timestamps: true });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;

