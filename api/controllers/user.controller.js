import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'


export const test = (req, res) => {
    res.json({
        message: 'Test API!'
    })
}

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'Unauthorized Access!'))
    try {
        console.log(req.body.password);

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