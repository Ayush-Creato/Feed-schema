const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




// Register new user
exports.register = async (req, res) => {
    try {
      const { username, email, password, fullName } = req.body;
      // console.log(req.body);
  
      // Validate required fields
      if (!username || !email || !password || !fullName) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if user already exists
      let user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      user = new User({
        username,
        email,
        password: hashedPassword,
        fullName
      });
  
      await user.save();
  
      res.status(201).json({
        message: 'User created successfully',
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Find user by email
    const user = await User.findOne({ $or: [{ email }, { username }] }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id,username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const publicUser = {
      name: user.fullName,
      username: user.username
    };

    res.json({
      token,
      user: publicUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['fullName', 'bio', 'profilePic'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const user = await User.findById(req.user.id);

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    res.json(user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
