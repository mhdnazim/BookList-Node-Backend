import { validationResult } from "express-validator"
import HttpError from "../middlewares/httpError.js"
import jwt from "jsonwebtoken"
import users from "../models/user.js"
import bcrypt from "bcrypt"

export const login = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(new HttpError("Invalid data inputs passed, please check your data before retry!", 422))
        } else {
            const { email, password } = req.body

            const user = await users.findOne({ email })

            if (! user) {
                return next(new HttpError("Invalid credentials", 400))
            } else {
                const isValidPassword = await bcrypt.compare(password, user.password)

                if (! isValidPassword) {
                    return next(new HttpError("Invalid credentials", 400))
                } else {

                    const token = jwt.sign({ userId: user._id, userEmail: user.email, role: user.role }, process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_TOKEN_EXPIRY }
                    )
                    res.status(200).json({
                        status: true,
                        message: 'Login successful',
                        data: {
                            _id: user._id,
                            role : user.role
                        },
                        access_token: token
                    })
                }
            }
        }
    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}

export const register = async (req, res, next) => {
    try {
        const errors = validationResult(req)

        if (! errors.isEmpty()) {
            console.log("error",errors)
            return next(new HttpError("Invalid data inputs passed, Please check your data before retry!", 422))
        } else {

            const { first_name, last_name, gender, email, password, date_of_birth, phone_number } = req.body

            const { role } = req.body

            // console.log(req.body ,"data");

            const preUser = await users.findOne({ email })

            if (preUser) {
                res.status(406).json({
                    status: true,
                    message: 'user already exists',
                    data: null,
                    access_token: null
                })

            } else {
                const saltValue = parseInt(process.env.SALT_ROUNDS)

                // const saltRounds = 10
                const salt = bcrypt.genSaltSync(saltValue)
                const hash = bcrypt.hashSync(password, salt)

                const newUser = new users({
                    first_name, last_name, gender, email, password: hash, date_of_birth, phone_number, role
                })
                await newUser.save()
                res.status(200).json({
                    status: true,
                    message: 'User registered successfully...!',
                    data: null,
                    access_token: null
                })

            }
        }

    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}

export const authConfirmTest = async (req, res, next) => {
    try {
        const errors = validationResult(req)

        if (! errors.isEmpty()) {
            return next(new HttpError("Invalid data inputs passed, Please check your data before retry!", 422))
        } else {
            const { userId } = req.userData

            res.status(200).json({
                status: true,
                message: 'Successfully authorized',
                data: userId,
                access_token: null
            })
        }
    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}