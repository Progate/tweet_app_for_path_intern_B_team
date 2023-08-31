import express from "express";
import {ensureAuthUser} from "@/middlewares/authentication";
import {createFollow, deleteFollow} from "@/models/follow";
import {checkuint} from "@/models/validation";

export const followRouter = express.Router();

// followの数を取得するAPI (不必要)
// followRouter.get("/:userId", async (req, res) => {
//   const {userId} = req.params;
//   const followCount = await getUserFollowCount(Number(userId));
//   // followCountを返す
//   res.send({followCount});
// });

followRouter.post("/:userId", ensureAuthUser, async (req, res, next) => {
  const {userId} = req.params;
  const iuserId = checkuint(userId);
  switch (iuserId) {
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
  const currentUserId = req.authentication?.currentUserId;
  const prevUrl = req.query.redirect;
  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return next(new Error("Invalid error: currentUserId is undefined."));
  }

  // 自分はフォローできないようにする
  if (currentUserId === Number(userId)) {
    return next(new Error("Invalid error: currentUserId is equal to userId."));
  }

  try {
    await createFollow(currentUserId, Number(userId));
    res.redirect(String(prevUrl));
  } catch (error) {
    return next(error);
  }
});

followRouter.delete("/:userId", ensureAuthUser, async (req, res, next) => {
  const {userId} = req.params;
  const currentUserId = req.authentication?.currentUserId;
  const prevUrl = req.query.redirect;
  if (currentUserId === undefined) {
    return next(new Error("Invalid error: currentUserId is undefined."));
  }

  // 自分はunfollowできないようにする
  if (currentUserId == Number(userId)) {
    return next(new Error("Invalid error: currentUserId is equal to userId."));
  }

  try {
    await deleteFollow(currentUserId, Number(userId));
    res.redirect(String(prevUrl));
  } catch (error) {
    return next(error);
  }
});
