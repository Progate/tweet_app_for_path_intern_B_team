import { Follow } from "@prisma/client";
import { databaseManager } from "@/db/index";
import { selectUserColumnsWithoutPassword, UserWithoutPassword } from "./user";

// type FollowData = Pick<Follow, "followerId" | "followeeId">;

/**
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
 * @param followerId
 * @param followeeId
 * @returns
 */
export const createFollow = async (
  followerId: number,
  followeeId: number,
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
 * @param userId
 * @return Array of userId's followers
 */
export const getFollowers = async (
  userId: number,
): Promise<Array<{ follower: UserWithoutPassword }> | null> => {
  const prisma = databaseManager.getInstance();
  const followers = await prisma.follow.findMany({
    where: {
      followeeId: userId,
    },
    select: {
      follower: {
        select: {
          ...selectUserColumnsWithoutPassword,
        },
      },
    },
  });
  return followers;
};

/**
 * @param userId
 * @return Array of userId's followers
 */
export const getFollowees = async (
  userId: number,
): Promise<Array<{ follower: UserWithoutPassword }> | null> => {
  const prisma = databaseManager.getInstance();
  const followers = await prisma.follow.findMany({
    where: {
      followeeId: userId,
    },
    select: {
      follower: {
        select: {
          ...selectUserColumnsWithoutPassword,
        },
      },
    },
  });
  return followers;
};
