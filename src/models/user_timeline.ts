import {PostWithUser, getAllFollowsPosts} from "./post";
import {
  getUserWithPostsIncludeRetweet,
  UserWithoutPassword,
  getUserLikedPosts,
  //getUserfollowedPosts,
} from "./user";
import {getAllRetweetedPosts} from "./retweet";
import {currentUserMiddleware} from "@/middlewares/current_user";
import {time} from "console";

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

//全ての投稿を表示するタイムラインで使用可能
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
export const getAllfollowsPostTimeline = async (
  userId: number
): Promise<Timeline[]> => {
  const posts = await getAllFollowsPosts(userId);
  const retweetPosts = await getAllRetweetedPosts();

  // const posts2: Timeline[] =
  // 加工場所
  // 1. getAllFollowsPosts2の中のクエリで加工
  // 2. ここ
  posts.map(users => {
    users.posts.map((post): Timeline => {
      return {
        type: "tweet",
        post: post,
        user: users.user,
        activedAt: post.createdAt,
      };
    });
  });
  // .map((post): Timeline => {
  //   return {
  //     type: "tweet",
  //     post,
  //     user: post.user,
  //     activedAt: post.createdAt,
  //   };
  // })

  //
  // {PostWithUser}[]
  //
  // {
  //  User
  // {PostWithUser}[]
  // }[]
  //
  //

  let timeline: Timeline[] = [];
  posts.map((posts): void => {
    //ここの型定義がvoidになってる
    // timeline[postid]
    timeline = timeline.concat(
      //timelineが決まり切る前に下でtimelineをつかっている？
      // timeline[postid] += timeline[postid]
      posts.posts.map((post): Timeline => {
        // timeline[postid]
        return {
          // timeline
          type: "tweet",
          post,
          user: post.user,
          activedAt: post.createdAt,
        };
      })
    );
  });

  //onst rttimeline: Timeline[] =
  const rttimeline: Timeline[] = retweetPosts.map((retweet): Timeline => {
    return {
      type: "retweet",
      post: retweet.post,
      user: retweet.user,
      activedAt: retweet.retweetedAt,
    };
  });
  timeline = timeline.concat(rttimeline);
  // const finaltimeline: Timeline[] = timeline.concat(rttimeline);

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
