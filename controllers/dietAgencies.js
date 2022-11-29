const { validationResult } = require('express-validator/check');

const Dietitian = require('../models/dietitian');
const Users = require('../models/user');

exports.getAllDietAgency = async (req, res, next) => {
  try {
    const dietitianList = await Dietitian.find({ isDietitians : true });
    if (!dietitianList) {
      const error = new Error('Could not find a diet agency');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ msg: 'Success', data: dietitianList });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getDietAgency = async (req, res, next) => {
  try {
    const dietitian = await Dietitian.findById(req.params.id);
    if (!dietitian) {
      const error = new Error('Could not find diet agency');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ msg: 'Success', data: dietitian });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getMyDietAgency = async (req, res, next) => {
  try {
    const user = await Users.findById(req.userId).select('-passwordHash');
    if (user.dietAgency.length === 0) {
      const error = new Error('Could not find a diet agency');
      error.statusCode = 404;
      throw error;
    }
    const dietAgencyId = user.dietAgency[0];
    const dietAgency = await Dietitian.find({ _id: dietAgencyId });
    res.status(200).json({ msg: 'Success', data: dietAgency });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.addDietAgency = async (req, res, next) => { //to test
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    let dietitian = new Dietitian({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone, 
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    const savedDietitian = await dietitian.save();
    const user = await Users.findById(req.userId);
    user.dietAgency.push(dietitian);
    await user.save();
    res.status(201).json({ msg: 'Success', data: savedDietitian });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.editDietAgency = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const user = await Users.findById(req.userId);
    if (user.dietAgency.length === 0) {
      const error = new Error('Could not find a diet agency');
      error.statusCode = 404;
      throw error;
    }
    const dietAgencyId = user.dietAgency[0];
    const dietitianFind = await Dietitian.findById(dietAgencyId.toString());
    const dietitianUpdate = await Dietitian.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name ? req.body.name : dietitianFind.name,
        email: req.body.email ? req.body.email : dietitianFind.email,
        passwordHash: req.body.passwordHash ? bcrypt.hashSync(req.body.passwordHash,10) : dietitianFind.passwordHash,
        phone: req.body.phone ? req.body.phone : dietitianFind.phone,
        street: req.body.street ? req.body.street : dietitianFind.street,
        apartment: req.body.apartment ? req.body.apartment : dietitianFind.apartment,
        zip: req.body.zip ? req.body.zip : dietitianFind.zip,
        city: req.body.city ? req.body.city : dietitianFind.city,
        country: req.body.country ? req.body.country : dietitianFind.country,
      },
      {
        new: true,
      }
    )
    res.status(200).json({ msg: 'Success', data: dietitianUpdate });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteDietAgency = async (req, res, next) => {
  try {
    const user = await Users.findById(req.userId);
    if (user.dietAgency.length === 0) {
      const error = new Error('Could not find a diet agency');
      error.statusCode = 404;
      throw error;
    }
    const dietAgencyId = user.dietAgency[0];
    const dietitianDelete = await Dietitian.findByIdAndRemove(dietAgencyId.toString());
    user.dietAgency.pull(req.params.id);
    await user.save();
    res.status(200).json({
      msg: 'Success',
      data: dietitianDelete,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}