import {PostWithUser, getAllFollowsPosts} from "./post";
import {
  getUserWithPostsIncludeRetweet,
  UserWithoutPassword,
  getUserLikedPosts,
  getUserfollowedPosts,
} from "./user";
import {getAllRetweetedPosts} from "./retweet";

type TweetType = "tweet" | "retweet" | "like" | "follow";

type Timeline = {
  type: TweetType;
  post: PostWithUser;
  user: UserWithoutPassword;
  activedAt: Date;
};

type UserTimeline = {
  user: UserWithoutPassword;
  timeline: Timeline[];
};

// export const getAllPostTimeline = async (): Promise<Timeline[]> => {
//   const posts = await getAllPosts();
//   const retweetPosts = await getAllRetweetedPosts();
//   const timeline: Timeline[] = posts
//     .map((post): Timeline => {
//       return {
//         type: "tweet",
//         post,
//         user: post.user,
//         activedAt: post.createdAt,
//       };
//     })
//     .concat(
//       retweetPosts.map((retweet): Timeline => {
//         return {
//           type: "retweet",
//           post: retweet.post,
//           user: retweet.user,
//           activedAt: retweet.retweetedAt,
//         };
//       })
//     );

//   timeline.sort((a, b) => {
//     return b.activedAt.getTime() - a.activedAt.getTime();
//   });
//   return timeline;
// };
export const getAllfollowsPostTimeline = async (): Promise<Timeline[]> => {
  const posts = await getAllFollowsPosts();
  const retweetPosts = await getAllRetweetedPosts();
  const timeline: Timeline[] = posts
    .map((post): Timeline => {
      return {
        type: "tweet",
        post,
        user: post.user,
        activedAt: post.createdAt,
      };
    })
    .concat(
      retweetPosts.map((retweet): Timeline => {
        return {
          type: "retweet",
          post: retweet.post,
          user: retweet.user,
          activedAt: retweet.retweetedAt,
        };
      })
    );

  timeline.sort((a, b) => {
    return b.activedAt.getTime() - a.activedAt.getTime();
  });
  return timeline;
};

export const getUserPostTimeline = async (
  userId: number
): Promise<UserTimeline | null> => {
  const user = await getUserWithPostsIncludeRetweet(userId);
  if (user === null) return null;
  const timeline: Timeline[] = user.posts
    .map((post): Timeline => {
      return {
        type: "tweet",
        post,
        user: post.user,
        activedAt: post.createdAt,
      };
    })
    .concat(
      user.retweets.map((retweet): Timeline => {
        return {
          type: "retweet",
          post: retweet.post,
          user: retweet.user,
          activedAt: retweet.retweetedAt,
        };
      })
    );

  timeline.sort((a, b) => {
    return b.activedAt.getTime() - a.activedAt.getTime();
  });
  return {
    user,
    timeline,
  };
};

export const getUserLikesTimeline = async (
  userId: number
): Promise<UserTimeline | null> => {
  const user = await getUserLikedPosts(userId);
  if (user === null) return null;
  const timeline: Timeline[] = user.likes.map((like): Timeline => {
    return {
      type: "like",
      post: like.post,
      user: user,
      activedAt: like.post.createdAt,
    };
  });

  return {
    user,
    timeline,
  };
};
export const getUserFollowsTimeline = async (
  userId: number
): Promise<UserTimeline | null> => {
  const user = await getUserfollowedPosts(userId);
  if (user === null) return null;
  const timeline: Timeline[] = user.follows.map((follow): Timeline => {
    return {
      type: "follow",
      post: follow.followee.posts.post,
      user: user,
      activedAt: follow.followee.posts.post.createdAt,
    };
  });

  return {
    user,
    timeline,
  };
};
