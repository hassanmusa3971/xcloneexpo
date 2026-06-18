import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      family: 4, // Forces IPv4, useful for avoiding DNS resolution delays in Node 17+
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)

    // Monitor connection health after initial successful connect
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB runtime error: ${err}`)
    })

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Mongoose will automatically try to reconnect.")
    })
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}