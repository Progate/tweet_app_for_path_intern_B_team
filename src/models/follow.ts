import {Follow} from "@prisma/client";
import {databaseManager} from "@/db/index";

// type FollowData = Pick<Follow, "followerId" | "followeeId">;

/**
 *
 * @param userId
 * @returns count of user's follow
 */
export const getUserFollowCount = async (userId: number): Promise<number> => {
  const prisma = databaseManager.getInstance();
  const count = await prisma.follow.count({
    where: {
      followerId: userId,
    },
  });
  return count;
};

/**
 *
 * @param userId
 * @returns count of user's follower
 */

export const getUserFollowerCount = async (userId: number): Promise<number> => {
  const prisma = databaseManager.getInstance();
  const count = await prisma.follow.count({
    where: {
      followeeId: userId,
    },
  });
  return count;
};

/**
 *
 * @param followerId
 * @param followeeId
 * @returns
 */
export const createFollow = async (
  followerId: number,
  followeeId: number
): Promise<Follow> => {
  const prisma = databaseManager.getInstance();
  const follow = await prisma.follow.create({
    data: {
      followerId,
      followeeId,
    },
  });
  return follow;
};

/**
 *
 * @param followerId
 * @param followeeId
 */
export const deleteFollow = async (
  followerId: number,
  followeeId: number
): Promise<void> => {
  const prisma = databaseManager.getInstance();
  await prisma.follow.delete({
    where: {
      /* eslint-disable camelcase */
      followerId_followeeId: {
        followerId,
        followeeId,
      },
    },
  });
};
