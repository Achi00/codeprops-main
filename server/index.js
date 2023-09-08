import express from "express";
import * as dotenv from 'dotenv'
import cors from 'cors'

import connectDB from "./mongodb/connect.js";
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import problemRouter from './routes/problem.route.js';
import eslintRouter from './routes/eslint.route.js';
import chatRouter from './routes/chat.route.js';
import prismaRouter from './routes/prisma.route.js';
import bodyParser from "body-parser";

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send({message: 'Hi'})
})

app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/problems', problemRouter)
app.use('/api/v1/eslint', eslintRouter)
app.use('/api/v1/chat', chatRouter)
app.use('/api/v1/prisma', prismaRouter)

const startServer = async () => {
    try {
        // connect to db
        connectDB(process.env.MONGODB_URL)
        app.listen(8080, () => console.log('server started on port http://localhost:8080'))
    } catch (error) {
        console.log(error);
    }
}

startServer()