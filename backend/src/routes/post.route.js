import express from "express"
import { createPost, deletePost, getPost, getPosts, getUserPosts, likePost } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const postRoutes = express.Router()

//Public Routes
postRoutes.get("/", getPosts)
postRoutes.get("/user/:username", getUserPosts)
postRoutes.get("/:postId", getPost)

//Private Routes
postRoutes.post("/", protectRoute, upload.single("image"), createPost)
postRoutes.post("/:postId/like", protectRoute, likePost)
postRoutes.delete("/:postId", protectRoute, deletePost)

export default postRoutes;