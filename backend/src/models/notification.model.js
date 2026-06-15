import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like", "comment"],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

// Add custom validation for conditional required fields based on notification type
notificationSchema.pre("validate", function (next) {
  const type = this.type;
  const post = this.post;
  const comment = this.comment;

  if (type === "like" || type === "comment") {
    if (!post) {
      this.invalidate("post", "Post is required for 'like' and 'comment' notifications");
    }
  }

  if (type === "comment") {
    if (!comment) {
      this.invalidate("comment", "Comment is required for 'comment' notifications");
    }
  }

  if (type === "follow") {
    if (post !== null && post !== undefined) {
      this.invalidate("post", "Post must be null for 'follow' notifications");
    }
    if (comment !== null && comment !== undefined) {
      this.invalidate("comment", "Comment must be null for 'follow' notifications");
    }
  }

  next();
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;