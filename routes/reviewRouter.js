import { Router } from "express"
import authCheck from "../middlewares/authCheck.js"
import { addReviews, editReview, reviewList, viewReview } from "../controllers/reviewController.js"
import { check } from "express-validator"

const router = Router()

router.use(authCheck)

router.post('/add', [
    check('book_id').not().isEmpty(),
    check('rating').not().isEmpty(),
    check('review').not().isEmpty()
], addReviews)

router.post('/list', reviewList)

router.post('/view', viewReview)

router.patch('/edit', editReview)

export default router