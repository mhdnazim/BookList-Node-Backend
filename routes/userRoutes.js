import { Router } from "express"
import { authConfirmTest, login, register } from "../controllers/userController.js"
import authCheck from "../middlewares/authCheck.js"
import { check } from "express-validator"

const router = Router()

router.post( '/login', 
[
    check('email').not().isEmpty(),
    check('password').not().isEmpty()
],login)

router.post('/register',
[
    check('first_name').not().isEmpty(),
    check('last_name').not().isEmpty(),
    check('gender').not().isEmpty(),
    check('email').isEmail(),
    check('password').not().isEmpty(),
    check('date_of_birth').not().isEmpty(),
    check('phone_number').isLength({ min: 10, max: 10 })
], register)

router.use(authCheck)

router.post('/test_auth_check', authConfirmTest)

export default router