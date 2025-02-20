const express = require("express");
const router = express.Router();
const { createPost, getPosts, likePost, deletePost, getRecommendations, createRecommendation, getPostByIds, importPostsFromJsonFile } = require("../controllers/posts");
const auth = require("../middleware/auth");
const upload = require("../utils/multerConfig");

const uploadFiles = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'media', maxCount: 1 }
  ]);

router.get("/recommendations",auth, getRecommendations);
router.post("/createpost",auth, uploadFiles, createPost);
router.get("/getposts",auth, getPosts);
router.patch("/like/:id",auth, likePost);
router.post("/:id/recommendations",auth, createRecommendation);
router.get("/:id", getPostByIds);
router.delete("/:id",auth, deletePost);
router.post('/import', importPostsFromJsonFile);

module.exports = router;
