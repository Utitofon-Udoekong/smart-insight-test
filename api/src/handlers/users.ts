import { Request, Response } from "express-serve-static-core";
import pool from "../database";
import { generateUsers } from "../utils";
import { NextFunction } from "express";
import { QueryResult } from "mysql2";

export async function createUsersInBatches(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if(req.headers.authorization !== `Bearer ${process.env.DB_CREATE_AUTHORIZATION}`){
    return res.status(401).send({message: 'Unauthorized request'})
  }
  const connection = await pool.getConnection()// Get a connection from the pool

  // Generate 500 users with 10 posts and 10 comments per user
  const users = await generateUsers(500);
  try {
    // Define SQL statements for each insert operation
    const userInsertSql =
      "INSERT INTO users (id, name, email, createdAt) VALUES (?, ?, ?, ?)";
    const postInsertSql =
      "INSERT INTO posts (id, userId, title, body, createdAt) VALUES (?, ?, ?, ?, ?)";
    const commentInsertSql =
      "INSERT INTO comments (id, postId, name, email, body, createdAt) VALUES (?, ?, ?, ?, ?, ?)";

    for (let i = 0; i < users.length; i ++) {

      // Start a transaction for the batch insert operations
      await connection.beginTransaction();

      try {

        // Prepare user insert promises
        const userPromises = users.map((user) =>
          pool.query(userInsertSql, [user.id, user.name, user.email, user.createdAt])
        );
        await Promise.all([
          ...userPromises,
        ]);

        // Prepare post insert promises (nested loops for user's posts)
        const postPromises = users.flatMap((user) =>
          user.posts.map((post) =>
            pool.query(postInsertSql, [post.id, user.id, post.title, post.body, post.createdAt])
          )
        );
        await Promise.all([
          ...postPromises,
        ]);

        // Prepare comment insert promises (nested loops for user's posts and comments)
        const commentPromises = users.flatMap((user) =>
          user.posts.flatMap((post) =>
            post.comments.map((comment) =>
              pool.query(commentInsertSql, [ comment.id, post.id, comment.name, comment.email, comment.body, comment.createdAt])
            )
          )
        );
        await Promise.all([
          ...commentPromises,
        ]);

        await connection.commit();
        return res.status(201).send({ status: "Users created successully" });

      } catch (error) {
        await connection.rollback();// Rollback transaction on error
        return next(error);

      } finally {
        connection.release(); // Release the connection back to the pool
      }
    }
  } catch (error) {
    return next(error);
  }
}

//O(N)
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.headers.authorization)
  try {
    const [rows] = await pool.query("SELECT * FROM users LIMIT 10");
    const rowQuery = (rows as QueryResult[]);
    if (rowQuery.length > 0) {
      return res.json({ users: rowQuery, length: rowQuery.length });
    }
    return res.send({ users: [] });
  } catch (error) {
    return next(error);
  }
}

// REQUIRES A USER ID IN THE REQUEST PARAMS
export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [row] = await pool.query("SELECT * FROM users WHERE id = ?",[req.params.id]);
    const rowQuery = (row as QueryResult[]);
    if (rowQuery.length > 0) {
      return res.json(rowQuery[0]);
    }
    return res.status(400).send({ message: "No user found" });
  } catch (error) {
    return next(error);
  }
}

// REQUIRES A USER ID IN THE REQUEST PARAMS
export async function getUserPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM posts WHERE userId = ? LIMIT 10",
      [req.params.id]
    );
    const rowQuery = (rows as QueryResult[]);
    if (rowQuery.length > 0) {
      return res.json({ posts: rowQuery, length: rowQuery.length });
    }
    return res.status(400).send({message: `Incorrect user id used`});
  } catch (error) {
    return next(error);
  }
}

// REQUIRES A POST ID IN THE REQUEST PARAMS
export async function getPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [row] = await pool.query("SELECT * FROM posts WHERE id = ?",[req.params.id]);
    const rowQuery = (row as QueryResult[]);
    if (rowQuery.length > 0) {
      return res.json(rowQuery[0]);
    }
    return res.status(400).send({ message: "Post does not exist" });
  } catch (error) {
    return next(error);
  }
}

// REQUIRES A POST ID IN THE REQUEST PARAMS
export async function getPostComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM comments WHERE postId = ? LIMIT 10",
      [req.params.id]
    );
    const rowQuery = (rows as QueryResult[]);
    if (rowQuery.length > 0) {
      return res.json({ comments: rowQuery, length: rowQuery.length });
    }
    return res.status(400).json({message: `Incorrect post id used`});
  } catch (error) {
    return next(error);
  }
}

// REQUIRES A POST ID IN THE REQUEST PARAMS
export async function getComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [row] = await pool.query("SELECT * FROM comments WHERE id = ?",[req.params.id]);
    const rowQuery = (row as QueryResult[]);
    if (rowQuery.length > 0) {
      return res.json(row);
    }
    return res.status(400).send({ message: "Comment does not exist" });
  } catch (error) {
    return next(error);
  }
}
