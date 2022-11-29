const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();
const User = require('../models/user');
const dietController = require('../controllers/diets');
const isAuth = require('../middleware/is-auth');
const { rolePermission } = require('../middleware/grant-access');


router.get('/', isAuth, rolePermission('readOwn', 'diets'), dietController.getDiets);

router.get('/users', isAuth, dietController.getUserDiets);

router.get(
    '/:id',
    isAuth,
    dietController.getDiet
);

router.post(
    '/', 
    isAuth,
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
    ],
    rolePermission('createOwn', 'diets'),
    dietController.createDiet
);

router.put(
    '/:id',
    isAuth,
    rolePermission('updateOwn', 'diets'),
    dietController.updateDiet
);

router.delete(
    '/:id',
    isAuth,
    rolePermission('deleteOwn', 'diets'),
    dietController.deleteDiet
);

module.exports = router;