var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');

router.get('/admin-dashboard', auth.isAdminLogged, (req, res, next) => {
    res.render('adminDashboard');
})

module.exports = router;
