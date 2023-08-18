import {Follow} from "@prisma/client";
import {databaseManager} from "@/db/index";

// type FollowData = Pick<Follow, "followerId" | "followeeId">;

type FollowCount = {
  followCount: number;
  followerCount: number;
};

/**
 *
 * @param userId
 * @returns {FollowCount}
 */
export const getUserFollowCount = async (userId: number): Promise<FollowCount> => {
  const prisma = databaseManager.getInstance();
  const FollowCount = await prisma.follow.count({
    where: {
      followerId: userId,
    },
  });

  const FolloweeCount = await prisma.follow.count({
    where: {
      followeeId: userId,
    },
  });

  return {
    followCount: FollowCount,
    followerCount: FolloweeCount,
  };
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

/**
 * 
 * @param { number } followerId 
 * @param { number } followeeId 
 * @returns { boolean } 
 */

export const IsFollow = async (
  followerId: number,
  followeeId: number
): Promise<boolean> => {
  const prisma = databaseManager.getInstance();
  const follow = await prisma.follow.findFirst({
    where: {
      followerId,
      followeeId,
    },
  });
  return follow !== null;
}