import express from "express"
import { createComment, deleteComment, getComments } from "../controllers/comment.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const commentRoutes = express.Router()

commentRoutes.get("/post/:postId", getComments)

commentRoutes.post("/post/:postId", protectRoute, createComment)
commentRoutes.delete("/:commentId", protectRoute, deleteComment)



export default commentRoutes