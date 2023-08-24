import {Post} from "@prisma/client";
import {databaseManager} from "@/db/index";
import {
  selectUserColumnsWithoutPassword,
  type UserWithoutPassword,
} from "@/models/user";
import {User} from "@prisma/client";

type PostData = Pick<Post, "content" | "userId">;
export type PostWithUser = Post & {user: UserWithoutPassword};
type followeepost = Array<PostWithUser>;

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
//全ての投稿を見れるようにするときに再利用可
// export const getAllPosts = async (): Promise<PostWithUser[]> => {
//   const prisma = databaseManager.getInstance();
//   const post = await prisma.post.findMany({
//     orderBy: {
//       createdAt: "desc",
//     },
//     select: {
//       id: true,
//       content: true,
//       userId: true,
//       createdAt: true,
//       updatedAt: true,
//       user: {
//         select: {
//           ...selectUserColumnsWithoutPassword,
//         },
//       },
//     },
//   });
//   return post;
// };
export const getAllFollowsPosts = async (): Promise<
  // PostWithUser[] & {followee: UserWithoutPassword} &
  //   Array<{
  //     post: PostWithUser;
  //     createdAt: Date;
  //     user: UserWithoutPassword;
  //   }>
  //PostWithUser[]
  UserWithoutPassword & PostWithUser[]
> => {
  const prisma = databaseManager.getInstance();
  // const post = await prisma.follow.followee.post.findMany({
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   select: {
  //     id: true,
  //     content: true,
  //     userId: true,
  //     createdAt: true,
  //     updatedAt: true,
  //     user: {
  //       select: {
  //         ...selectUserColumnsWithoutPassword,
  //       },
  //     },
  //   },
  // });
  const post = await prisma.follow.findMany({
    select: {
      followee: {
        ...selectUserColumnsWithoutPassword,
        select: {
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
  return post;
};
