const express = require("express");
const router = express.Router();
const { createPost, getPosts, likePost, deletePost, getRecommendations, createRecommendation, getPostByIds, importPostsFromJsonFile } = require("../controllers/posts");
const auth = require("../middleware/auth");

router.get("/recommendations",auth, getRecommendations);
router.post("/createpost",auth, createPost);
router.get("/getposts",auth, getPosts);
router.patch("/like/:id",auth, likePost);
router.post("/:id/recommendations",auth, createRecommendation);
router.get("/:id", getPostByIds);
router.delete("/:id",auth, deletePost);
router.post('/import', importPostsFromJsonFile);

module.exports = router;
