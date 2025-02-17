const express = require("express");
const router = express.Router();
const { createPost, getPosts, likePost, deletePost, getRecommendations, createRecommendation, getPostByIds } = require("../controllers/posts");
const auth = require("../middleware/auth");

router.get("/recommendations",auth, getRecommendations);
router.post("/createpost",auth, createPost);
router.get("/getposts",auth, getPosts);
router.patch("/like/:id",auth, likePost);
router.post("/:id/recommendations",auth, createRecommendation);
router.get("/:id",auth, getPostByIds);
router.delete("/:id",auth, deletePost);

module.exports = router;

