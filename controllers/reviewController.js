import { validationResult } from "express-validator"
import HttpError from "../middlewares/httpError.js"
import reviews from "../models/review.js"

export const addReviews = async (req, res, next) => {
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            console.log("error")
            return next(new HttpError("Invalid data inputs passed, Please check your data before retry!", 422))
        } else {
            const { book_id, rating, review } = req.body

            const { userId } = req.userData

            const newReview = new reviews({
                user: userId,
                book: book_id,
                rating,
                review
            })
            await newReview.save()
            res.status(200).json({
                status: true,
                message: '',
                data: newReview,
                access_token: null
            })
        }
    }
    catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}


export const reviewList = async (req, res, next) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return next(new HttpError("Something went wrong...", 422))
        } else {
            const reviewData = await reviews.find({})
                .populate({
                    path: 'user',
                    select: "first_name last_name"
                })
                .populate({
                    path: 'book',
                    select: "name"
                })

            res.status(200).json({
                status: true,
                message: '',
                data: reviewData,
                access_token: null
            })
        }

    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}


export const viewReview = async (req, res, next) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return next(new HttpError("Something went wrong...", 422))
        } else {
            const { _id } = req.body

            console.log(_id, "id")

            const review = await reviews.find({ book: _id })
                .populate({
                    path: 'user',
                    select: "first_name last_name _id"
                })
                .populate({
                    path: 'book',
                    select: "name"
                })
            // const bookData = await books.find(query)

            res.status(200).json({
                status: true,
                message: '',
                data: review,
                access_token: null
            })
        }

    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}


export const editReview = async (req, res, next) => {
    try {

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            console.log("error")
            return next(new HttpError("Invalid data inputs passed, Please check your data before retry!", 422))
        } else {
            const { userId } = req.userData

            
            const { _id, user, rating, review } = req.body
            console.log(_id, user, rating, review, "from edit")
            
            if (userId === user ) {

                const reviewData = await reviews.findOne({ _id })

                const updateReview = await reviews.findOneAndUpdate({ _id }, {
                    user, rating, review
                }, { new: true })
                res.status(200).json({
                    status: true,
                    message: '',
                    data: updateReview,
                    access_token: null
                })
            } 
            else {
                res.status(200).json({
                    status: true,
                    message: 'Permission denied...',
                    data: null,
                    access_token: null
                })
            }


        }

    }
    catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}

