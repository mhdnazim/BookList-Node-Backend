import { Router } from "express"
import authCheck from "../middlewares/authCheck.js"
import { addBook, bookList, deleteBook, editBook, viewBook } from "../controllers/bookController.js"
import multerConfig from "../middlewares/multer/uploadImage.js"
import { addReviews } from "../controllers/reviewController.js"
import { check } from "express-validator"

const router = Router()

router.use(authCheck)

router.post('/list', bookList)

router.post('/add', multerConfig.single("image"),
[
    check('name').not().isEmpty(),
    check('author').not().isEmpty(),
    check('genre').not().isEmpty(),
    check('star_rating').isAlphanumeric(),
    check('published').not().isEmpty(),
    check('price').isAlphanumeric(),
    check('language').not().isEmpty()
], addBook)

router.patch('/edit', multerConfig.single("image"), editBook)

router.patch('/delete', deleteBook)

router.post('/view', viewBook)

export default router