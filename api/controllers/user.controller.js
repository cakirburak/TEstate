import Listing from "../models/listing.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'


export const getUserInfo = async (req, res, next) => {
    try {
        const userInfo = await User.findById(req.params.id)
        const { password, ...rest } = userInfo._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorized Access!'))
    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            // $set will update the fields that already updated and ignores the rest
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        },{new:true})
        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest) 
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorized Access!'))
    try {
        await User.findByIdAndDelete(req.user.id)
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted!')
    } catch (error) {
        next(error) 
    }
}

export const getUserListings = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorized Access!'))
    try {
        const listings = await Listing.find({userRef: req.params.id})
        res.status(200).json(listings)
    } catch (error) {
        next(error) 
    }
}