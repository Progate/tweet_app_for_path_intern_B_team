import express from "express";
import {ensureAuthUser} from "@/middlewares/authentication";
import {getUserFollowCount, createFollow} from "@/models/follow";

export const followRouter = express.Router();


// followの数を取得するAPI (不必要)
followRouter.get("/:userId", async (req, res) => {
  const {userId} = req.params;
  const followCount = await getUserFollowCount(Number(userId));
  // followCountを返す
  res.send({followCount});
});

followRouter.post("/:userId", ensureAuthUser, async (req, res, next) => {
  const {userId} = req.params;
  const currentUserId = req.authentication?.currentUserId;
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
    res.status(200).json({message: `followed userId ${userId}`});
  } catch (error) {
    return next(error);
  }
});