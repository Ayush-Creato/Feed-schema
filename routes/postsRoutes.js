const express = require("express");
const router = express.Router();
const { createPost, getPosts, incrementViewCount, likePost, getPostById, deletePost } = require("../controllers/posts");
const auth = require("../middleware/auth");

router.post("/createpost",auth, createPost);
router.get("/getposts",auth, getPosts);
router.get("/view/:id",auth, incrementViewCount);
router.patch("/like/:id",auth, likePost);
router.get("/:id",auth, getPostById);
router.delete("/:id",auth, deletePost);


module.exports = router;

