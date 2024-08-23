import { Router } from "express";
import rateLimit from 'express-rate-limit'
import apicache from 'apicache'
import { getUserPosts, getUsers, getPostComments, createUsersInBatches, getComment, getPost, getUser } from "../handlers/users";

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
});

// The api cache lasts for 2 minutes. In production builds, this value can change
// depending on how long the data changes
const cache = apicache.middleware
const router = Router()

router.get("/users", limiter, cache('2 minutes'), getUsers)
router.get("/users/:id", limiter, cache('2 minutes'), getUser)

router.post("/users/create", createUsersInBatches)


router.get("/users/:id/posts", limiter, cache('2 minutes'), getUserPosts)
router.get("/users/posts/:id", limiter, cache('2 minutes'), getPost)

router.get("/users/posts/:id/comments", limiter, cache('2 minutes'), getPostComments)
router.get("/users/comments/:id", limiter, cache('2 minutes'), getComment)



export default router