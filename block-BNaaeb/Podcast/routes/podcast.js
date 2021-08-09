var express = require('express');
var router = express.Router();
var Podcast = require('../models/Podcast');
var moment = require('moment');
var multer = require('multer');
var path = require('path');
var auth = require('../middlewares/auth');

var uploadPath = path.join(__dirname, '../', 'public/podcasts');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

/* GET new form */
router.get('/new',auth.isAdminLogged, function (req, res, next) {
  const error = req.flash('error')[0];
  res.render('createPodcast', { error });
});

// POST new poscast
router.post('/', upload.fields([{name:'audioFile'},{name:'imageFile'}]), (req, res, next) => {
  req.body.audioFile = req.files.audioFile[0].filename;
  req.body.imageFile = req.files.imageFile[0].filename;
  Podcast.create(req.body, (error, podcast) => {
    if (error) {
      if (error.name === 'ValidationError') {
        req.flash('error', error.message);
        return res.redirect('/podcast/new');
      }
    } else {
      res.redirect('/podcast');
    }
  });
});

// GET all podcasts
router.get('/', auth.isAdminAndUserLogged, (req, res, next) => {
  var category = req.user.category || req.admin.category;
  if(category){
    console.log(category, "fcscvsvsv");
  }
  Podcast.find({}, (error, podcasts) => {
    if (error) return next(error);
    // temp = podcasts.map(podcast=>{
    //   if(podcast.releasedDate){
    //     podcast.title = "title";
    //     podcast.releasedDate = moment(podcast.releasedDate).format('MMMM Do YYYY')
    //   }
    //   return podcast;
    // })
    res.render('podcasts', { podcasts });
  });
});

// GET single podcast
router.get('/:id', (req, res, next) => {
  const podcastId = req.params.id;
  Podcast.findById(podcastId, (error, podcast) => {
    res.render('podcastDetails', {podcast});
  });
});

module.exports = router;
