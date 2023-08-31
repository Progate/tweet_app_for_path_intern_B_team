import express from "express";
import { ensureAuthUser } from "@/middlewares/authentication";
import { createRetweet, deleteRetweet } from "@/models/retweet";
import { checkuint } from "@/models/validation";

export const retweetRouter = express.Router();

retweetRouter.post(
  "/:postId/retweets",
  ensureAuthUser,
  async (req, res, next) => {
    const { postId } = req.params;
    const ipostId = checkuint(postId);
    switch (ipostId) {
      case -2: {
        return next(
          new Error(
            "Invalid error: userId is not appropriate format'started with zero'",
          ),
        );
      }
      case -1: {
        return next(new Error("Invalid error: userId is NaN"));
      }
    }
    const currentUserId = req.authentication?.currentUserId;
    if (currentUserId === undefined) {
      // `ensureAuthUser` enforces `currentUserId` is not undefined.
      // This must not happen.
      return next(new Error("Invalid error: currentUserId is undefined."));
    }
    await createRetweet({ userId: currentUserId, postId: ipostId });
    res.redirect(`/posts/${postId}`);
  },
);

retweetRouter.delete(
  "/:postId/retweets",
  ensureAuthUser,
  async (req, res, next) => {
    const { postId } = req.params;
    const ipostId = checkuint(postId);
    switch (ipostId) {
      case -2: {
        return next(
          new Error(
            "Invalid error: userId is not appropriate format'started with zero'",
          ),
        );
      }
      case -1: {
        return next(new Error("Invalid error: userId is NaN"));
      }
    }
    const currentUserId = req.authentication?.currentUserId;
    if (currentUserId === undefined) {
      // `ensureAuthUser` enforces `currentUserId` is not undefined.
      // This must not happen.
      return next(new Error("Invalid error: currentUserId is undefined."));
    }
    await deleteRetweet({ userId: currentUserId, postId: ipostId });
    res.redirect(`/posts/${postId}`);
  },
);
