import express from "express";
import { body, validationResult } from "express-validator";
import { formatDate } from "@/lib/convert_date";
import { createPost, deletePost, getPost, updatePost } from "@/models/post";
import { getPostRetweetedCount, hasUserRetweetedPost } from "@/models/retweet";
//import {getAllPostTimeline} from "@/models/user_timeline";
import { getPostLikedCount, hasUserLikedPost } from "@/models/like";
import { ensureAuthUser } from "@/middlewares/authentication";
import { ensureOwnerOfPost } from "@/middlewares/current_user";
import { getAllfollowsPostTimeline } from "@/models/user_timeline";
import { IsFollow } from "@/models/follow";
import { checkuint } from "@/models/validation";

export const followingpostRouter = express.Router();

// postRouter.get("/", ensureAuthUser, async (req, res) => {
//   const timeline = await getAllPostTimeline();
//   res.render("posts/index", {
//     timeline,
//   });
// });

followingpostRouter.get("/", ensureAuthUser, async (req, res) => {
  const currentUserId = req.authentication?.currentUserId;
  const { userId } = req.params;
  const timeline = await getAllfollowsPostTimeline(Number(currentUserId));
  res.render("followingposts/index", {
    timeline,
  });
});

followingpostRouter.get("/new", ensureAuthUser, (req, res) => {
  res.render("followingposts/new", {
    post: {
      content: "",
    },
    errors: [],
  });
});

followingpostRouter.get("/:postId", ensureAuthUser, async (req, res, next) => {
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
  const post = await getPost(Number(postId));
  if (!post || !post.id) {
    return next(new Error("Invalid error: The post or post.id is undefined."));
  }

  const currentUserId = req.authentication?.currentUserId;
  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return next(new Error("Invalid error: currentUserId is undefined."));
  }
  const likeCount = await getPostLikedCount(post.id);
  const hasLiked = await hasUserLikedPost(currentUserId, post.id);
  const retweetCount = await getPostRetweetedCount(post.id);
  const hasRetweeted = await hasUserRetweetedPost(currentUserId, post.id);
  res.render("followingposts/show", {
    post,
    formatDate,
    likeCount,
    hasLiked,
    retweetCount,
    hasRetweeted,
  });
});

followingpostRouter.post(
  "/",
  ensureAuthUser,
  body("content", "Content can't be blank").notEmpty(),
  async (req, res, next) => {
    const { content } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("follownigposts/new", {
        post: {
          content,
        },
        errors: errors.array(),
      });
    }

    const currentUserId = req.authentication?.currentUserId;
    if (currentUserId === undefined) {
      // `ensureAuthUser` enforces `currentUserId` is not undefined.
      // This must not happen.
      return next(new Error("Invalid error: currentUserId is undefined."));
    }
    await createPost({ content, userId: currentUserId });
    req.dialogMessage?.setMessage("Post successfully created");
    res.redirect("/followingposts");
  },
);

followingpostRouter.get(
  "/:postId/edit",
  ensureAuthUser,
  ensureOwnerOfPost,
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
    const post = await getPost(Number(postId));
    res.render("followingposts/edit", {
      post,
      errors: [],
    });
  },
);

followingpostRouter.patch(
  "/:postId",
  ensureAuthUser,
  ensureOwnerOfPost,
  body("content", "Content can't be blank").notEmpty(),
  async (req, res, next) => {
    const { content } = req.body;
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("followingposts/edit", {
        post: {
          content,
        },
        errors: errors.array(),
      });
    }
    await updatePost(Number(postId), content);
    req.dialogMessage?.setMessage("Post successfully edited");
    res.redirect("/followingposts");
  },
);

followingpostRouter.delete(
  "/:postId",
  ensureAuthUser,
  ensureOwnerOfPost,
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
    await deletePost(Number(postId));
    req.dialogMessage?.setMessage("Post successfully deleted");
    res.redirect("/followingposts");
  },
);
