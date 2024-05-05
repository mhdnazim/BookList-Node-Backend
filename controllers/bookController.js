import { validationResult } from "express-validator"
import books from "../models/book.js"
import HttpError from "../middlewares/httpError.js"
import * as fs from 'fs'
import { log } from "console"

export const bookList = async (req, res, next) => {
    try {
        const errors = validationResult(req)

        if (! errors.isEmpty()) {
            return next(new HttpError("Something went wrong...", 422))
        } else {
            const { q, star_rating, price } = req.body
            const query = { isDeleted: false }

            if(q){
                const searchQuery = q.toLowerCase()
                query.name = { $regex: searchQuery, $options: "i" }
            }
            if (star_rating){
                query.star_rating = star_rating
            }
            if (price){
                // const searchQuery = q.toLowerCase()
                query.price = { $lte: price }
            }
            const bookData = await books.find(query)
            // const bookData = await books.find(query)

            res.status(200).json({
                status: true,
                message: '',
                data: bookData,
                access_token: null
            })
        }
        
    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}

export const viewBook = async (req, res, next) => {
    try {
        const errors = validationResult(req)

        if (! errors.isEmpty()) {
            return next(new HttpError("Something went wrong...", 422))
        } else {
            const { _id } = req.body
            const query = { isDeleted: false }

            if(_id){
                query._id = _id
            }
            const bookData = await books.findOne(query)
            // const bookData = await books.find(query)

            res.status(200).json({
                status: true,
                message: '',
                data: bookData,
                access_token: null
            })
        }
        
    } catch (err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}

export const addBook = async (req, res, next) => {
    try {

        const errors = validationResult(req)

        if (! errors.isEmpty()) {
            console.log("error")
            return next(new HttpError("Invalid data inputs passed, Please check your data before retry!", 422))
        } else {
            const { role } = req.userData

            if(role === "admin") {
                const { name, author, genre, star_rating, published, price, language } = req.body

                const image = req.file ? process.env.BASE_URL + "/books/cover_image/" + req.file.filename: null

                const newBook = new books({
                    name, author, genre, star_rating, published, price, language, image
                })
                await newBook.save()
                res.status(200).json({
                    status: true,
                    message: 'New book successfully added...!',
                    data: null,
                    access_token: null
                })
            } else {
                res.status(200).json({
                    status: true,
                    message: 'Permission denied...',
                    data: null,
                    access_token: null
                })
            }  
        }
    }
    catch (err){
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}

export const editBook = async (req, res, next) => {
    try {

        const errors = validationResult(req)

        if (! errors.isEmpty()) {
            console.log("error")
            return next(new HttpError("Invalid data inputs passed, Please check your data before retry!", 422))
        } else {
            const { role } = req.userData

            if (role === "admin") {
                const { _id, name, author, genre, star_rating, published, price, language } = req.body

                const bookData = await books.findOne({ _id })

                const image = req.file ? process.env.BASE_URL + "/books/cover_image/" + req.file.filename : bookData.image

                if (req.file && bookData.image !== null) {
                    const prevImgPath = bookData.image.slice(22)
                    fs.unlink(`./uploads/${ prevImgPath }`, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    })
                }

                const updateBook = await books.findOneAndUpdate({ _id }, {
                    name, author, genre, star_rating, published, price, language, image
                }, { new: true })
                res.status(200).json({
                    status: true,
                    message: '',
                    data: updateBook,
                    access_token: null
                })
            } else {
                res.status(200).json({
                    status: true,
                    message: 'Permission denied...',
                    data: null,
                    access_token: null
                })
            }
            
            
        }

    }
    catch (err){
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}

export const deleteBook = async (req, res, next) => {
    try {
        const errors = validationResult(req)

        if (! errors.isEmpty()) {
            console.log("error")
            return next(new HttpError("Invalid data inputs passed, Please check your data before retry!", 422))
        } else {
            const { role } = req.userData

            if (role === "admin") {
                const { _id } = req.body

                const deletedBook = await books.findOneAndUpdate({ _id }, {
                    isDeleted: true
                }, { new: true })
                res.status(200).json({
                    status: true,
                    message: '',
                    data: deletedBook,
                    access_token: null
                })
            } else { 
                res.status(200).json({
                    status: true,
                    message: 'Permission denied...',
                    data: null,
                    access_token: null
                })
            }
        }
    } catch(err) {
        console.error(err)
        return next(new HttpError("Oops! Process failed, please do contact admin", 500))
    }
}