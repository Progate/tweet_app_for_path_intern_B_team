import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const insertUsers = async (
  data: Prisma.Enumerable<Prisma.UserCreateManyInput>,
): Promise<void> => {
  const createMany = await prisma.user.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(
    `successfully inserted records of ${createMany.count} to user table`,
  );
};

export const insertPosts = async (
  data: Prisma.Enumerable<Prisma.PostCreateManyInput>,
): Promise<void> => {
  const createMany = await prisma.post.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(
    `successfully inserted records of ${createMany.count} to post table`,
  );
};

export const insertLikes = async (
  data: Prisma.Enumerable<Prisma.LikeCreateManyInput>,
): Promise<void> => {
  const createMany = await prisma.like.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(
    `successfully inserted records of ${createMany.count} to like table`,
  );
};
export const insertFollows = async (
  data: Prisma.Enumerable<Prisma.FollowCreateManyInput>,
): Promise<void> => {
  const createMany = await prisma.follow.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(
    `successfully inserted records of ${createMany.count} to follow table`,
  );
};
