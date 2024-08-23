import needle from "needle";

import { User, Post, Comment, JPUser } from "../types";
const nanoid = import("nanoid");

export async function generateUsers(userCount: number): Promise<User[]> {
  let users: User[] = [];
  const jpUsers = await needle(
    "get",
    "https://jsonplaceholder.typicode.com/users"
  );
  for (var i = 0; i < userCount; i++) {
    const itemIndex = i % jpUsers.body.length;
    const _user = jpUsers.body[itemIndex] as JPUser
    const userId = (await nanoid).nanoid();

    let user: User = {
      id: userId,
      name: _user.name,
      email: _user.email,
      createdAt: new Date(),
      posts: await generateUserPost(_user.id, userId),
    };

    users.push(user);
  }
  console.log("users generated", users.length);
  return users;
}

//O(N)
// GENERATE 10 POSTS FOR A GIVEN [JPUSERID]
async function generateUserPost(
  jpUserId: number,
  userId: string
): Promise<Post[]> {
  let userPosts: Post[] = [];
  const jpPostsArray = await needle(
    "get",
    `https://jsonplaceholder.typicode.com/users/${jpUserId}/posts?_start=0&_limit=10`
  );
  for (let i = 0; i < 10; i++) {
    const postId = (await nanoid).nanoid();
    const itemIndex = i % jpPostsArray.body.length;
    const _post = jpPostsArray.body[itemIndex] as Post;

    let post: Post = {
      userId: userId,
      id: postId,
      body: _post.body,
      //Use a uniquely generated post title.
      title: generateUniquePostTitle(_post.title, i),
      createdAt: new Date(),
      comments: await generateUserPostComment(_post.id),
    };
    userPosts.push(post);
  }

  return userPosts;
}

//O(N)
function generateUniquePostTitle(title: string, index: number) {
  // Split the title into an array of characters
  const characters = title.split("");

  // Randomize the order of the characters
  characters.sort(() => Math.random() - 0.5);

  // Join the characters back into a string
  const randomizedTitle = characters.join("");

  // Create a base title using the randomized title
  const baseTitle = randomizedTitle + " (Post #" + (index + 1) + ")";
  return baseTitle;
}

//GENERATE 10 COMMENTS FOR A GIVEN [POSTID]
async function generateUserPostComment(postId: string): Promise<Comment[]> {
  let postComments: Comment[] = [];
  const jpCommentsArray = await needle(
    "get",
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments?_start=0&_limit=10`
  );
  for (var i = 0; i < 10; i++) {
    // Handle potential array index out of bounds issue by cycling withting the
    // exisiting length of jpCommentsArray
    const _comment = jpCommentsArray.body[i % jpCommentsArray.body.length];
    const comment: Comment = {
      postId: postId,
      id: (await nanoid).nanoid(),
      name: _comment.name,
      email: _comment.email,
      body: _comment.body,
      createdAt: new Date(),
    };
    postComments.push(comment);
  }
  return postComments;
}
