import {Follow, Post} from "@prisma/client";
import {databaseManager} from "@/db/index";
import {
  selectUserColumnsWithoutPassword,
  type UserWithoutPassword,
} from "@/models/user";
import {User} from "@prisma/client";

type PostData = Pick<Post, "content" | "userId">;
export type PostWithUser = Post & {user: UserWithoutPassword};
type followeepost = PostWithUser[];

export const createPost = async (postData: PostData): Promise<Post> => {
  const prisma = databaseManager.getInstance();
  const post = await prisma.post.create({
    data: postData,
  });
  return post;
};

export const updatePost = async (
  postId: number,
  content: string
): Promise<Post> => {
  const prisma = databaseManager.getInstance();
  const post = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      content,
    },
  });
  return post;
};

export const deletePost = async (postId: number): Promise<Post> => {
  const prisma = databaseManager.getInstance();
  const post = await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return post;
};

export const getPost = async (postId: number): Promise<PostWithUser | null> => {
  const prisma = databaseManager.getInstance();
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      content: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          ...selectUserColumnsWithoutPassword,
        },
      },
    },
  });
  return post;
};

export const getAllPosts = async (): Promise<PostWithUser[]> => {
  const prisma = databaseManager.getInstance();
  const post = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      content: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          ...selectUserColumnsWithoutPassword,
        },
      },
    },
  });
  return post;
};

export const getAllFollowsPosts = async (
  userId: number
): Promise<
  Array<{
    user: UserWithoutPassword;
    posts: PostWithUser[];
  }>
> => {
  const prisma = databaseManager.getInstance();

  const postOrigin = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followee: {
        select: {
          ...selectUserColumnsWithoutPassword,
          posts: {
            select: {
              id: true,
              content: true,
              userId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
  const post2 = postOrigin.map(record => {
    return {
      user: {
        id: record.followee.id,
        createdAt: record.followee.createdAt,
        updatedAt: record.followee.updatedAt,
        name: record.followee.name,
        email: record.followee.email,
        imageName: record.followee.imageName,
      },
      posts: record.followee.posts.map((post): PostWithUser => {
        return {
          id: post.id,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          userId: record.followee.id,
          user: {
            id: record.followee.id,
            createdAt: record.followee.createdAt,
            updatedAt: record.followee.updatedAt,
            name: record.followee.name,
            email: record.followee.email,
            imageName: record.followee.imageName,
          },
        };
      }),
    };
  });

  return post2;
};
