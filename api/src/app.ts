import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import { notFound, errorHandler } from './middleware';
import usersRouter from './routes/users'
import job from './background/create-user'

dotenv.config()

const app = express()

app.use(express.json())
app.set('trust proxy', 1)
app.use(morgan('dev'));
app.use(helmet());
app.use(cors())

app.use("/api/v1", usersRouter)

app.use(notFound)
app.use(errorHandler)
job.invoke()

export default app