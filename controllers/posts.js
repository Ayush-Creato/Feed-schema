const Posts = require('../models/Posts');
const Recommendation = require('../models/recommendations');
const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');
const { default: axios } = require('axios');
const { uploadToS3, deleteFromS3 } = require('../utils/s3Helper');

// Create a new post
// exports.createPost = async (req, res) => {
//   try {
//     const {thumbnail, caption, audio, hashtags, media } = req.body;
    
//     const post = new Posts({
//       thumbnail, 
//       caption,
//       audio,
//       hashtags,
//       media
//     });

//     await post.save();
//     res.status(201).json(post);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }


// Update createPost to use multer
exports.createPost = async (req, res) => {
  try {
    const {user, caption, audio, hashtags } = req.body;
    // const thumbnailFile = req.files['thumbnail'][0];
    const mediaFile = req.files['media'][0];

    // Prepare files for S3 upload
    // const thumbnailData = {
    //   name: Date.now() + '-' + thumbnailFile.originalname,
    //   data: thumbnailFile.buffer,
    //   mimetype: thumbnailFile.mimetype
    // };

    const mediaData = {
      name: Date.now() + '-' + mediaFile.originalname,
      data: mediaFile.buffer,
      mimetype: mediaFile.mimetype
    };

    // Upload thumbnail and media to S3
    //  await uploadToS3(thumbnailData, 'thumbnails');
     await uploadToS3(mediaData, 'media');
    
    // const thumbnailUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/thumbnails/${thumbnailData.name}`;

    const mediaUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/media/${mediaData.name}`;
    
    
    const post = new Posts({
      user,
      // thumbnail: thumbnailUrl, 
      caption,
      audio,
      hashtags: JSON.parse(hashtags),
      media: mediaUrl
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: error.message });
  }
}

// Delete a post and delete files from S3
exports.deletePost = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete files from S3
    await Promise.all([
      deleteFromS3(post.thumbnail),
      deleteFromS3(post.media)
    ]);

    // Delete post from database
    await Posts.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: error.message });
  }
}


exports.uploadVideo = async (req, res) => {
  try {
    const {thumbnail, caption, audio, hashtags, media, views_count, likes_count, shares_count } = req.body;
    
    const post = new Posts({
      user: req.user.userId,
      thumbnail, 
      caption,
      audio,
      hashtags,
      media,
      views_count,
      likes_count,
      shares_count
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
      path.join(__dirname, '../video_data.json'),
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
      likes_count: post.likes_count,
      // comments_count: post.comments_count,
      views_count: post.views_count,
      video_quality: post.video_quality,
      share_count: post.share_count,
      play_count: post.play_count
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
