const User = require('../models/user');
const { roles } = require('../role');

exports.rolePermission = function(action, resource) {
  return async (req, res, next) => {
   try {
    const permission = roles.can(req.role)[action](resource);
    if (!permission.granted) {
      const error = new Error("You don't have enough permission to perform this action");
      error.statusCode = 401;
      throw error;
    }
    next()
   } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
    }
    next(err);
   }
  }
 }

exports.roleActions = async function (req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (user.dietAgency.length === 0) {
      const error = new Error('Could not find a diet agency');
      error.statusCode = 404;
      throw error;
    }
    const dietAgencyId = user.dietAgency[0];
    if (req.params.id !== dietAgencyId.toString()) {
      const error = new Error("You don't have enough permission to perform this action");
      error.statusCode = 403;
      throw error;
    }
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
    }
    next(err);
  }
}