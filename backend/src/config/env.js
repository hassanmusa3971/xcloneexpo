import dotenv from "dotenv"
dotenv.config()

// Define required environment variables
const REQUIRED_ENV_VARS = [
  "MONGO_URI",
  "CLERK_SECRET_KEY",
  "CLOUDINARY_API_SECRET",
  "CLERK_PUBLISHABLE_KEY",
  "ARCJET_KEY",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "NODE_ENV",
  "PORT"
]

// Validate required environment variables
const missingEnvVars = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables:\n${missingEnvVars.map(v => `  - ${v}`).join("\n")}\n\nPlease ensure all required variables are set in your .env file.`
  )
}

// Validate and normalize NODE_ENV
const validNodeEnv = ["development", "test", "production"]
const nodeEnv = process.env.NODE_ENV.toLowerCase()
if (!validNodeEnv.includes(nodeEnv)) {
  throw new Error(
    `Invalid NODE_ENV value: "${process.env.NODE_ENV}". Must be one of: ${validNodeEnv.join(", ")}`
  )
}

// Coerce PORT to a number
const port = parseInt(process.env.PORT, 10)
if (isNaN(port)) {
  throw new Error(`Invalid PORT value: "${process.env.PORT}". PORT must be a valid number.`)
}

export const ENV = Object.freeze({
    PORT: port,
    NODE_ENV: nodeEnv,
    MONGO_URI: process.env.MONGO_URI,

    // Clerk
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

    // Arcjet
    ARCJET_ENV: process.env.ARCJET_ENV || nodeEnv,
    ARCJET_KEY: process.env.ARCJET_KEY,

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
})