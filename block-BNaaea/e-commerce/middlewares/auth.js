var User = require('../models/User');
module.exports = {
  isUserLogged: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      return res.redirect('/');
    }
  },
  isAdminLogged: (req, res, next) => {
    if (req.session && req.session.adminId) {
      next();
    } else {
      return res.redirect('/');
    }
  },
  isUserAndAdminLogged: (req, res, next) => {
    if ((req.session && req.session.userId) || req.session.adminId) {
      next();
    } else {
      return res.redirect('/');
    }
  },

  userInfo: (req, res, next) => {
    var userId = req.session && req.session.userId;
    if (userId) {
      User.findById(userId, 'name email', (error, user) => {
        if (error) return next(error);
        user.type = 'User';
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
  adminInfo: (req, res, next) => {
    var adminId = req.session && req.session.adminId;
    if (adminId) {
      User.findById(adminId, 'name email', (error, admin) => {
        if (error) return next(error);
        admin.type = 'Admin';
        req.admin = admin;
        res.locals.admin = admin;
        next();
      });
    } else {
      req.admin = null;
      res.locals.admin = null;
      next();
    }
  },
};
