const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');

const userController = require('../controllers/user.controller');

router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Invalid Email'),

        body('fullname.firstname')
            .isLength({ min: 2 })
            .withMessage('Firstname must be at least 2 characters long'),

        body('fullname.lastname')
            .isLength({ min: 2 })
            .withMessage('Lastname must be at least 2 characters long'),

        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
    ],
    userController.registerUser
);


router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Invalid Email"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
    ],
    userController.loginUser
);

router.get('/profile', authMiddleware.authenticateUser, userController.getProfile);
router.post('/logout', authMiddleware.authenticateUser, userController.logoutUser);

module.exports = router;