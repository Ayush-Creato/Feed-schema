const express = require("express");
const router = express.Router();
const { register, login, getUserProfile, updateUserProfile } = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/:username", auth,getUserProfile);
router.patch("/profile",auth, updateUserProfile);

module.exports = router;