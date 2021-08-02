var User = require('../model/User');

module.exports = {
  isUserLogged: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.redirect('/users/login');
    }
  },
  userInfo: (req, res, next) => {
    var userId = req.session && req.session.userId;
    if (userId) {
      User.findById(userId, (error, user) => {
        if (error) return next(error);
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
//   isSameUser: (req, res, next) => {
//       if(req.session.userId === req.user._id){
//           next()
//       }else {
//           res.redirect('/articles');
//       }
//   }
};
