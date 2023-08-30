import express from "express";
import {ensureAuthUser} from "@/middlewares/authentication";
import {createFollow, deleteFollow} from "@/models/follow";
import {HTTPStatusError} from "@/middlewares/errHandler";

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
  const currentUserId = req.authentication?.currentUserId;
  const prevUrl = req.query.redirect;
  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return next(new HTTPStatusError("Invalid error: user ID is undefind", 422));
  }

  // 自分はフォローできないようにする
  if (currentUserId === Number(userId)) {
    return next(
      new HTTPStatusError("Invalid error: currentUserId is your ID", 400)
    );
  }

  try {
    await createFollow(currentUserId, Number(userId));
    res.redirect(String(prevUrl));
  } catch (error) {
    return next(
      new HTTPStatusError("Invalid error: user ID is not number", 501, error)
    );
  }
});

followRouter.delete("/:userId", ensureAuthUser, async (req, res, next) => {
  const {userId} = req.params;
  const currentUserId = req.authentication?.currentUserId;
  const prevUrl = req.query.redirect;
  if (currentUserId === undefined) {
    return next(new HTTPStatusError("Invalid error: user ID is undefind", 422));
  }

  // 自分はunfollowできないようにする
  if (currentUserId == Number(userId)) {
    return next(
      new HTTPStatusError("Invalid error: currentUserId is your ID", 400)
    );
  }

  try {
    await deleteFollow(currentUserId, Number(userId));
    res.redirect(String(prevUrl));
  } catch (error) {
    return next(
      new HTTPStatusError("Invalid error: user ID is not number", 501, error)
    );
  }
});
