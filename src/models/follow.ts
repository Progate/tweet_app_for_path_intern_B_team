import {Follow} from "@prisma/client";
import {databaseManager} from "@/db/index";
import {selectUserColumnsWithoutPassword, UserWithoutPassword} from "./user";

// type FollowData = Pick<Follow, "followerId" | "followeeId">;

type FollowCount = {
  followCount: number;
  followerCount: number;
};
export type UserWithBool = {user: UserWithoutPassword} & {
  isfollowed: boolean;
};
/**
 * @param userId
 * @returns {FollowCount}
 */
export const getUserFollowCount = async (
  userId: number
): Promise<FollowCount> => {
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
 * @param userId
 * @return Array of userId's followers
 */
export const getFollowers = async (
  userId: number
): Promise<UserWithoutPassword[]> => {
  const prisma = databaseManager.getInstance();
  const followers = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    orderBy: {
      followedAt: "asc",
    },
    select: {
      followee: {
        select: {
          ...selectUserColumnsWithoutPassword,
        },
      },
    },
  });
  const final = followers.map((user): UserWithoutPassword => {
    return {
      id: user.followee.id,
      name: user.followee.name,
      imageName: user.followee.imageName,
      email: user.followee.email,
      createdAt: user.followee.createdAt,
      updatedAt: user.followee.updatedAt,
    };
  });
  return final;
};

/**
 * @param userId
 * @return Array of userId's followers
 */
export const getFollowees = async (
  userId: number
): Promise<UserWithoutPassword[]> => {
  const prisma = databaseManager.getInstance();
  const followers = await prisma.follow.findMany({
    where: {
      followeeId: userId,
    },
    orderBy: {
      followedAt: "asc",
    },
    select: {
      follower: {
        select: {
          ...selectUserColumnsWithoutPassword,
        },
      },
    },
  });
  const final = followers.map((user): UserWithoutPassword => {
    return {
      id: user.follower.id,
      email: user.follower.email,
      name: user.follower.name,
      imageName: user.follower.imageName,
      updatedAt: user.follower.updatedAt,
      createdAt: user.follower.createdAt,
    };
  });
  return final;
};

/**
 * @param userId
 * @return Array of userId's followers
 */
export const getFollowersWithIsFollowed = async (
  userId: number
): Promise<UserWithBool[]> => {
  const followers = await getFollowers(userId);
  const final = followers.map((user): UserWithBool => {
    return {
      user: user,
      isfollowed: true,
    };
  });
  return final;
};

/**
 * @param userId
 * @return Array of userId's followers
 */
export const getFolloweesWithIsFollowed = async (
  userId: number,
  currentUserId: number
): Promise<UserWithBool[]> => {
  const followees = await getFollowees(userId);
  const final: UserWithBool[] = await Promise.all(
    followees.map(async user => {
      return {
        user: user,
        isfollowed: await IsFollow(userId, currentUserId),
      };
    })
  );
  return final;
};

/**
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
};
