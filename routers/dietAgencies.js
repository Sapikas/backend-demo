const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();
const Dietitian = require('../models/dietitian');
const isAuth = require('../middleware/is-auth');
const dietAgencyController = require('../controllers/dietAgencies');
const { rolePermission } = require('../middleware/grant-access');

router.get('/', isAuth, dietAgencyController.getAllDietAgency);

router.get('/mydietagency', isAuth, dietAgencyController.getMyDietAgency);

router.get('/:id', isAuth, dietAgencyController.getDietAgency);

router.post("/search", isAuth, async (req,res)=>{
    let payload = req.body.payload.trim();
    let search = await Dietitian.find({name: {$regex: new RegExp('^'+payload+'.*','i')}}).exec();
    search = search.slice(0,10);
    res.status(200).send({ payload: search });
});

router.post('/', isAuth,
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return Dietitian.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail()
    ],
    dietAgencyController.createDietAgency
);

router.put(
    '/mydietagency',
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
    ],
    isAuth,
    rolePermission('updateOwn', 'dietAgency'),
    dietAgencyController.updateDietAgency
);

router.delete('/mydietagency', isAuth, rolePermission('deleteOwn', 'dietAgency'), dietAgencyController.deleteDietAgency);

module.exports = router;