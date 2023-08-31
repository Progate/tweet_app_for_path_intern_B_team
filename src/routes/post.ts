import express from "express";
import {body, validationResult} from "express-validator";
import {formatDate} from "@/lib/convert_date";
import {createPost, deletePost, getPost, updatePost} from "@/models/post";
import {getPostRetweetedCount, hasUserRetweetedPost} from "@/models/retweet";
import {getAllPostTimeline} from "@/models/user_timeline";
import {getPostLikedCount, hasUserLikedPost} from "@/models/like";
import {ensureAuthUser} from "@/middlewares/authentication";
import {ensureOwnerOfPost} from "@/middlewares/current_user";
import {IsFollow} from "@/models/follow";
import {checkuint} from "@/models/validation";
export const postRouter = express.Router();

postRouter.get("/", ensureAuthUser, async (req, res) => {
  const timeline = await getAllPostTimeline();
  res.render("posts/index", {
    timeline,
  });
});

postRouter.get("/new", ensureAuthUser, (req, res) => {
  res.render("posts/new", {
    post: {
      content: "",
    },
    errors: [],
  });
});

postRouter.get("/:postId", ensureAuthUser, async (req, res, next) => {
  const {postId} = req.params;
  const ipostId = checkuint(postId);
  switch (ipostId) {
    case -2: {
      return next(
        new Error(
          "Invalid error: userId is not appropriate format'started with zero'"
        )
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
  const isFollowed = await IsFollow(currentUserId, post.userId);
  const retweetCount = await getPostRetweetedCount(post.id);
  const hasRetweeted = await hasUserRetweetedPost(currentUserId, post.id);
  res.render("posts/show", {
    post,
    formatDate,
    likeCount,
    hasLiked,
    retweetCount,
    hasRetweeted,
    isFollowed,
    currentUrl: req.originalUrl,
  });
});

postRouter.post(
  "/",
  ensureAuthUser,
  body("content", "Content can't be blank").notEmpty(),
  async (req, res, next) => {
    const {content} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("posts/new", {
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
    await createPost({content, userId: currentUserId});
    req.dialogMessage?.setMessage("Post successfully created");
    res.redirect("/posts");
  }
);

postRouter.get(
  "/:postId/edit",
  ensureAuthUser,
  ensureOwnerOfPost,
  async (req, res, next) => {
    const {postId} = req.params;
    const ipostId = checkuint(postId);
    switch (ipostId) {
      case -2: {
        return next(
          new Error(
            "Invalid error: userId is not appropriate format'started with zero'"
          )
        );
      }
      case -1: {
        return next(new Error("Invalid error: userId is NaN"));
      }
    }
    const post = await getPost(ipostId);
    res.render("posts/edit", {
      post,
      errors: [],
    });
  }
);

postRouter.patch(
  "/:postId",
  ensureAuthUser,
  ensureOwnerOfPost,
  body("content", "Content can't be blank").notEmpty(),
  async (req, res, next) => {
    const {content} = req.body;
    const {postId} = req.params;
    const ipostId = checkuint(postId);
    switch (ipostId) {
      case -2: {
        return next(
          new Error(
            "Invalid error: userId is not appropriate format'started with zero'"
          )
        );
      }
      case -1: {
        return next(new Error("Invalid error: userId is NaN"));
      }
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("posts/edit", {
        post: {
          content,
        },
        errors: errors.array(),
      });
    }
    await updatePost(Number(postId), content);
    req.dialogMessage?.setMessage("Post successfully edited");
    res.redirect("/posts");
  }
);

postRouter.delete(
  "/:postId",
  ensureAuthUser,
  ensureOwnerOfPost,
  async (req, res, next) => {
    const {postId} = req.params;
    const ipostId = checkuint(postId);
    switch (ipostId) {
      case -2: {
        return next(
          new Error(
            "Invalid error: userId is not appropriate format'started with zero'"
          )
        );
      }
      case -1: {
        return next(new Error("Invalid error: userId is NaN"));
      }
    }
    await deletePost(ipostId);
    req.dialogMessage?.setMessage("Post successfully deleted");
    res.redirect("/posts");
  }
);
