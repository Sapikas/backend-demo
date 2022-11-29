const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/users');
const isAuth = require('../middleware/is-auth');
const { rolePermission } = require('../middleware/grant-access');

const router = express.Router();

router.get('/', isAuth, rolePermission('readAny', 'profile'), authController.getUsers);

router.get('/:id',  isAuth, rolePermission('readAny', 'profile'), authController.getUserById);

router.get('/myprofile', isAuth, rolePermission('readOwn', 'profile'), authController.getMyProfile);

router.post(
    '/',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                    return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('passwordHash')
            .trim()
            .isLength({ min: 2 }),
        body('name')
            .trim()
            .not()
            .isEmpty()    
    ],
    authController.signup
);

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (!userDoc) {
                        return Promise.reject('E-Mail address not exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 2 }),
    ],
    authController.login
);

router.put('/:id', isAuth,
    [
        body('email')
            .optional()
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .optional()
            .trim()
            .isLength({ min: 2 }),
        body('name')
            .optional()
            .trim()
            .not()
            .isEmpty()
    ],
    rolePermission('updateAny', 'profile'),
    authController.updateUser
);

router.put('/myprofile', isAuth, rolePermission('readOwn', 'profile'), authController.updateMyProfile);

router.delete('/myProfile', isAuth, rolePermission('deleteOwn', 'profile'), authController.deleteUser);

module.exports = router;