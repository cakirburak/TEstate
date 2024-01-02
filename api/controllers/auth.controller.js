import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    // parse the req body 
    const { username, email, password } = req.body
    // hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10)
    // create the User model
    const newUser = new User({ username, email, password: hashedPassword})
    try{
        // save the user to the database
        await newUser.save();
        res.status(201).json('User created successfully!')
    } catch (err) {
        next(err)
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body
    try {

        // validations
        const validUser = await User.findOne({email})
        if(!validUser) return next(errorHandler(404,'User not found!'))
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword) return next(errorHandler(401, 'Wrong email or password!'))

        // create cookie based on user id which has hashed
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)

        // hide hashed password from the client on response
        const { password: pass, ...rest} = validUser._doc

        res
            .cookie('access_token', token, { httpOnly: true})
            .status(200)
            .json(rest) // send the rest as res
    } catch (err) {
        
    }
}