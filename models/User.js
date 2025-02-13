const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  fullName: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [150, 'Bio cannot exceed 150 characters']
  },
  profilePic: {
    type: String,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  private: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

userSchema.methods.getPublicProfile = function() {
    const user = this.toObject();
    delete user.password;
    return user;
  };

module.exports = mongoose.model('User', userSchema);