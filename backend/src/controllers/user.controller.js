import asyncHandler from "express-async-handler"
import User from "../models/user.model.js"
import Notification from "../models/notification.model.js"
import { clerkClient, getAuth } from "@clerk/express"
import mongoose from "mongoose"


export const getUserProfile = asyncHandler(async(req, res) => {
    const { username } = req.params
    const user = await User.findOne({ username })
    if(!user) return res.status(404).json({ error: "User not found"})
    res.status(200).json(user)

})

export const updateProfile = asyncHandler(async(req, res) => {
    const{ userId } = getAuth(req)
    // const user = await User.findOneAndUpdate({ clerkId: userId}, req.body, { new: true })
    const allowedFields = ["firstname", "lastname", "username", "bio", "profilePicture", "bannerImage", "location"]
   const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
   )
   const user = await User.findOneAndUpdate({ clerkId: userId}, { $set: updates }, { new: true, runValidators: true})
    if(!user) return res.status(404).json({ error: "User not found"})
    res.status(200).json(user)

})

export const syncUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  // check if user already exists in mongodb
  const existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    return res.status(200).json({ user: existingUser, message: "User already exists" });
  }

  // create new user from Clerk data
  const clerkUser = await clerkClient.users.getUser(userId);
  const primaryEmailObj = clerkUser.emailAddresses?.find(
      (addr) => addr.id === clerkUser.primaryEmailAddressId
    ) ?? clerkUser.emailAddresses?.[0];
  const primaryEmail = primaryEmailObj?.emailAddress;

  if (!primaryEmail) {
    return res.status(400).json({ error: "Clerk user doesn't have a primary email address." });
  }

  const derivedName = primaryEmail.split("@")[0];
  if (!clerkUser.firstName || !clerkUser.lastName) {
    return res.status(400).json({ error: "Clerk user is missing required name fields." });
   }
  const userData = {
    clerkId: userId,
    email: primaryEmail,
    firstname: clerkUser.firstName,
    lastname: clerkUser.lastName,
    username: derivedName,
    profilePicture: clerkUser.imageUrl || "",
  };

  const user = await User.create(userData);

  res.status(201).json({ user, message: "User created successfully" });
})

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
})

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetUserId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
   return res.status(400).json({ error: "Invalid target user id" });
  }

 
  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" });
    if (currentUser._id.equals(targetUser._id)) {
    return res.status(400).json({ error: "You cannot follow yourself" });
    }
    const isFollowing = currentUser.following.some((id) => id.equals(targetUser._id));

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUser._id },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { following: targetUser._id },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUser._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  res.status(200).json({
    message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
  });
})
