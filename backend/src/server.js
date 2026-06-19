import express from "express";
import "dotenv/config";
import cors from "cors"
import mongoose from "mongoose"; // Import mongoose to access its disconnect method
import { clerkMiddleware } from "@clerk/express"
import { ENV } from "./config/env.js";
import { connectDb } from "./config/db.js";
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";
const app = express();

//MiddleWares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(arcjetMiddleware)
app.use(clerkMiddleware())

// Keep a reference to the server instance
let server;

app.get("/", (req, res) => {
  res.send("This is the backend server.");
});
//All routes
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/notifications", notificationRoutes)
app.use((err, req, res, next) => {
  console.error("Unhandle error: ", err)
  if (res.headersSent) return next(err);
  return res.status(500).json({ message: "Internal server error"})
})

// Function to handle graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived signal ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log("HTTP server closed.");
      try {
        // Disconnect from MongoDB if connected
        await mongoose.disconnect();
        console.log("MongoDB disconnected.");
        process.exit(0);
      } catch (dbError) {
        console.error("Error disconnecting from MongoDB:", dbError);
        process.exit(1);
      }
    });
  } else {
    process.exit(0); // If server wasn't even started, just exit
  }

  // Force close after a timeout if connections don't close gracefully
  setTimeout(() => {
    console.error("Forcefully shutting down server due to timeout.");
    process.exit(1);
  }, 10000).unref(); // unref() allows the program to exit if this is the only active handle
};

const startServer = async () => {
  await connectDb();
  server = app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  }).on("error", (error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });
};

// Start the server and catch any initial errors
startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});

// Handle process termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
