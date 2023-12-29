import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()



const port = 3000;
const app = express();

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});

app.listen(3000, () => {
    console.log(`Server is running on port ${port}`)
})
