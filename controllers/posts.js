const Posts = require('../models/Posts');
const Recommendation = require('../models/recommendations');
const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');
const { default: axios } = require('axios');

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
    // Fetch post IDs from Python service
    const response = await axios.post(`http://localhost:5000/recommend/67b41ed3c0aad1ad47590597`);
    const postIds = response.data.recommended_posts; // Adjust this based on your Python
    
    const posts = await Posts.find({
      _id: { $in: postIds }
    }).populate('user', 'username');

    res.json(posts);
  } catch (error) {
    console.error('Error:', error);
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


exports.importPostsFromJsonFile = async (req, res) => {
  try {
    // Read the JSON file
    const jsonData = await fs.readFile(
      path.join(__dirname, '../video_recommendations.json'),
      'utf8'
    );
    
    const postsData = JSON.parse(jsonData);

    if (!Array.isArray(postsData)) {
      return res.status(400).json({ message: 'File content must be an array of posts' });
    }

    // Map the data to match your Posts schema
    const formattedPosts = postsData.map(post => ({
      user: post.user,
      thumbnail: post.thumbnail,
      caption: post.caption,
      audio: post.audio,
      hashtags: post.hashtags,
      media: post.media,
      likes: post.likes || [],
      comments: post.comments || [],
      length: post.length,
      videoQuality: post.videoQuality,
      share: post.share,
      play: post.play
    }));

    // Insert multiple posts
    const result = await Posts.insertMany(formattedPosts);
    
    res.status(201).json({
      message: `Successfully imported ${result.length} posts from JSON file`,
      posts: result
    });
  } catch (error) {
    console.error('Error importing posts:', error);
    res.status(500).json({ message: error.message });
  }
}
