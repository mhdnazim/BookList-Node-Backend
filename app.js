import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import connectDB from './DB-connection/dbConnection.js'
import reviewRouter from "./routes/reviewRouter.js"
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'
import { fileURLToPath } from 'url'
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

dotenv.config()

const app = express()
const port = process.env.PORT || 8000

connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/",(req,res,next) => 
{
    res.send("Api is Running...!")
})

app.use('/user', userRoutes)
app.use('/book', bookRoutes)
app.use('/review', reviewRouter)
app.use('/', express.static(join(__dirname, 'uploads')))

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server started running on port ${port}`));