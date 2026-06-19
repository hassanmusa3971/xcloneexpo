import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { deleteNotification, getNotifications } from "../controllers/notification.controller.js";

const notificationRoutes = express.Router()

notificationRoutes.get("/", protectRoute, getNotifications)
notificationRoutes.delete("/notificationId", protectRoute, deleteNotification)

export default notificationRoutes;