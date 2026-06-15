import mongoose from "mongoose"
import { ENV } from "./env.js"


export const connectDb = async() => {
    try {
      await  mongoose.connect(
        ENV.MONGO_URI, {
            family: 4
        }
      )
      console.log("Connected db successfully")
    } catch (error) {
        console.log("Error connecting to mongodb", error)
        process.exit(1)
    }
}