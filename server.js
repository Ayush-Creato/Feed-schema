const express = require("express");
const cors = require("cors");
const connectDB = require("./config");
const userRoutes = require("./routes/userRoutes");
const postsRoutes = require("./routes/postsRoutes");
require('dotenv').config();


const app = express();


// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/posts", postsRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});