const Posts = require('../models/Posts');
const Recommendation = require('../models/recommendations');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const {thumbnail, caption, audio, hashtags, media } = req.body;
    
    const post = new Posts({
      user: req.user.userId,
      thumbnail, 
      caption,
      audio,
      hashtags,
      media
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Posts.find({user:req.user.userId})
      .populate('user', 'username')
      .populate('recommendations')
      .populate({
        path:'likes',
        model:'User',
        select:'username'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user.userId);
    
    if (likeIndex === -1) {
      post.likes.push(req.user.userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get posts by array of ids
exports.getPostByIds = async (req, res) => {
  try {
    const postIds = req.body.postIds;
    
    const posts = await Posts.find({
      _id: { $in: postIds }
    }).populate('user', 'username')

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    await Posts.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ user: req.user.userId })
    res.json(recommendations);
  } catch (error) {
    console.log('Detailed error:', error);
    res.status(500).json({ message: error.message });
  }
}

// Create a recommendation
exports.createRecommendation = async (req, res) => {
  try {
    const { recommendations } = req.body;

    const recommendation = new Recommendation({ 
      user: req.user.userId,  
      recommendations 
    }); 
    await recommendation.save();

    res.status(201).json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get recommendations for a user
exports.getRecommendationsForUser = async (req, res) => {
  try {
    const userId = req.params.id; 

    const user = await User.findById(userId);
    const recommendations = user.recommendations;

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


