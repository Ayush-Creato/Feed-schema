const express = require("express");
const router = express.Router();
const { createPost, getPosts, likePost, getPostById, deletePost, getRecommendations, createRecommendation } = require("../controllers/posts");
const auth = require("../middleware/auth");

router.get("/recommendations",auth, getRecommendations);
router.post("/createpost",auth, createPost);
router.get("/getposts",auth, getPosts);
router.patch("/like/:id",auth, likePost);
router.post("/:id/recommendations",auth, createRecommendation);
router.get("/:id",auth, getPostById);
router.delete("/:id",auth, deletePost);

module.exports = router;

