const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort([['name', 'asc']]);
    res.status(200).json({ msg: 'Success', data: users });
  }catch(err) {
    if (!err.statusCode) {
      err.statusCode = 404;
    }
    next(err);
  }
}

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash -dateCreated -diets');
    if (!user){
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ msg: 'Success', data: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 404;
    }
    next(err);
  }
}

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = req.body.passwordHash;
    const name = req.body.name;
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      passwordHash: hashedPw,
      name: name,
      phone: req.body.phone,
      role: req.body.role,
      dietAgency: req.body.dietAgency,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country
    });
    const savedUser = await user.save();
    res.status(201).json({ msg: 'Success', userId: savedUser._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const secret = process.env.secret;
    const user = await User.findOne({email: email});
    const isEqual = await bcrypt.compare(password, user.passwordHash);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      next(error);
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
        role: user.role
      },
      secret,
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.updateMyProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      next(error);
    }
    const userFind = await User.findById(req.userId).select('-dateCreated');
    const userUpdate = await User.findByIdAndUpdate(
      req.userId,
      {
          name: req.body.name ? req.body.name : userFind.name,
          email: req.body.email ? req.body.email : userFind.email,
          passwordHash: req.body.passwordHash ? bcrypt.hashSync(req.body.passwordHash,10) : userFind.passwordHash,
          phone: req.body.phone ? req.body.phone : userFind.phone,
          role: req.body.role ? req.body.role : userFind.role,
          dietAgency: req.body.dietAgency ? req.body.dietAgency : userFind.dietAgency,
          street: req.body.street ? req.body.street : userFind.street,
          apartment: req.body.apartment ? req.body.apartment : userFind.apartment,
          zip: req.body.zip ? req.body.zip : userFind.zip,
          city: req.body.city ? req.body.city : userFind.city,
          country: req.body.country ? req.body.country : userFind.country
      },
      {
          new: true
      }
    );
    if (!userUpdate) {
      const error = new Error('Cannot update the user');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ msg: 'Update user', user: userUpdate });
  } catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const userDelete = await User.findByIdAndRemove(req.userId);
    if (!userDelete){
      const error = new Error('User not found');
      error.statusCode = 404;
      next(error);
    }
    res.status(200).json({ msg: 'Success', user: userDelete });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}