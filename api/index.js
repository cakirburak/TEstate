import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import path from 'path'

const __dirname = path.resolve()

dotenv.config()

const port = 3000;
const app = express()
app.use(express.json())
app.use(cookieParser())

const runMongoDBConnection = async () => {
	await mongoose.connect(process.env.MONGO)
		.then(() => {
			console.log("Connected to MongoDB")
		})
}
runMongoDBConnection().catch((err) => console.error(err))

app.listen(3000, () => {
	console.log(`Server is running on port ${port}`)
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500
	const message = err.message || 'Internal Server Error'
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	})
})