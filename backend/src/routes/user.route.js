import express from "express"
import { followUser, getCurrentUser, getUserProfile, syncUser, updateProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const userRoutes = express.Router()

//public route
userRoutes.get("/profile/:username", getUserProfile)

//protected routes
userRoutes.post("/sync", protectRoute, syncUser)
userRoutes.put("/profile", protectRoute, updateProfile)
userRoutes.get("/me", protectRoute, getCurrentUser)
userRoutes.post("/follow/:targetUserId", followUser)



export default userRoutes;
