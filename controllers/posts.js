const Posts = require('../models/Posts');
const Recommendation = require('../models/recommendations');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { videoUrl, thumbnail, caption, audio, hashtags } = req.body;
    console.log(req.user);
    
    const post = new Posts({
      user: req.user.userId,
      videoUrl,
      thumbnail,
      caption,
      audio,
      hashtags
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

    const posts = await Posts.find()
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Increment view count
exports.incrementViewCount = async (req, res) => {
  try {
    const post = await Posts.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
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

    const likeIndex = post.likes.indexOf(req.user.id);
    
    if (likeIndex === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a post by id
exports.getPostById = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    res.json(post);
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
    const recommendations = await Recommendation.find();
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Create a recommendation
exports.createRecommendation = async (req, res) => {
  try {
    const { user, posts, recommendations } = req.body;

    const recommendation = new Recommendation({ user, posts, recommendations }); 
    await recommendation.save();
    res.status(201).json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


