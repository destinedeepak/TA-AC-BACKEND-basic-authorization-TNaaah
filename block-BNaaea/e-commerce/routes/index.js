var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const error = req.flash('error')[0];
  res.render('index', { title: 'E-Commerce', error});
});

router.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
})

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('adminId');
  res.redirect('/');
})

module.exports = router;
