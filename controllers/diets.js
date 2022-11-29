const { validationResult } = require('express-validator/check');

const Diets = require('../models/Diets');
const User = require('../models/user');

exports.getDiets = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    const documents = await Diets.find({ Dietitians: user.dietAgency[0] }).countDocuments();
    if (documents === 0) {
      const error = new Error('Could not diets for your diet agency');
      error.statusCode = 404;
      throw error;
    }
    totalItems = documents;
    const dietsList = await Diets.find({ Dietitians: user.dietAgency[0] }).skip((currentPage - 1) * perPage).limit(perPage);
    res.status(200).json({ msg: 'Success', data: dietsList, totalItems: totalItems });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getDiet = async (req ,res, next) => {
  try {
    const diets = await Diets.findById(req.params.id);
    if (!diets) {
      const error = new Error('There are no diets');
      error.statusCode = 404;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (user.email !== diets.email && user?.dietAgency[0].toString() !== diets.Dietitians.toString()) {
      const error = new Error('You are not authorized to see the diet');
      error.statusCode = 401;
      throw error;
    }
    res.status(200).json({ msg: 'Success', data: diets });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getUserDiets = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const dietsList = await Diets.find({ email: user.email }).select('-Dietitians');
    if (dietsList.length === 0) {
      const error = new Error('Could not find diets');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ msg: 'Success', data: dietsList });
  }catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.createDiet = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const user = await User.findById(req.userId).select('-passwordHash');
    const userDietAgency = user.dietAgency[0];
    let diets = new Diets({
      Dietitians: userDietAgency,
      email: req.body.email,
      diets: req.body.diets,
    });
    user.diets.push(diets);
    await user.save();
    const savedDiet = await diets.save();
    res.status(201).json({ msg: 'Success', data: savedDiet });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.updateDiet = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const el = user.diets.find(el => el.toString() === req.params.id);
    if (!el) {
      const error = new Error('No diets found!');
      error.statusCode = 404;
      throw error;
    }
    const dietsUpdate = await Diets.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        diets: req.body.diets,
      },
      {
        new: true,
      },
    );
    res.status(200).json({ msg: 'Success', data: dietsUpdate });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteDiet = async (req, res, next) => {
  try {
    let user = await User.findById(req.userId);
    const el = user.diets.find(el => el.toString() === req.params.id);
    if (!el) {
      const error = new Error('No diets found!');
      error.statusCode = 404;
      throw error;
    }
    const dietsDelete = await Diets.findByIdAndRemove(req.params.id);
    user.diets.pull(req.params.id);
    await user.save();
    res.status(200).json({ msg: 'Success', data: dietsDelete });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}