var express = require('express');
var router = express.Router();
var Article = require('../model/Article');
var Comment = require('../model/Comment');
var auth = require('../middlewares/auth');
var ownerShip = require('../utils/ownerShip');

/* GET users listing. */
// send form
router.get('/new',auth.isUserLogged, (req, res, next) => {
  res.render('form');
});

// create new form
router.post('/', (req, res, next) => {
  req.body.author = req.session.userId;
  req.body.tags = req.body.tags.split(',').map((ele) => ele.trim());
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles');
  });
});

// get all articles
router.get('/', (req, res, next) => {
  Article.find({}, (error, articles) => {
    if (error) return next(error);
    const fullName = req.flash('fullName')[0];
    res.render('articles', { articles, fullName});
  });
});

// get article details
router.get('/:slug', (req, res, next) => {
  let slug = req.params.slug;
  Article.findOne({ slug })
    .populate('comments').populate('author')
    .exec((err, article) => {
      if (err) return next(err);
      res.render('articleDetails', { article });
    });
});

router.use(auth.isUserLogged);

// likes
router.get('/:slug/like', (req, res, next) => {
  let slug = req.params.slug;
  Article.findOneAndUpdate({ slug }, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles/' + slug);
  });
});

// dislikes
router.get('/:slug/dislike', (req, res, next) => {
  let slug = req.params.slug;
  Article.findOneAndUpdate(
    { slug },
    { $inc: { dislikes: 1 } },
    (err, article) => {
      if (err) return next(err);
      res.redirect('/articles/' + slug);
    }
  );
});

// edit
router.get('/:slug/edit', (req, res, next) => {
  let slug = req.params.slug;
  Article.findOne({ slug }, (err, article) => {
    if (err) return next(err);
    article.tags = article.tags.reduce((acc, ele, i, arr) => {
      acc += ele;
      if (i !== arr.length - 1) {
        acc += ',';
      }
      return acc;
    }, '');
    if(ownerShip.isSameUser(req, article.author)){
      res.render('editarticle', { article });
    }else{
       res.redirect('/articles/'+ slug);
    }
  });
});

// update
router.post('/:slug/update', (req, res, next) => {
  let slug = req.params.slug;
  req.body.tags = req.body.tags.split(',').map((ele) => ele.trim());
  Article.findOneAndUpdate({ slug }, req.body, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles/' + article.slug);
  });
});

//delete
router.get('/:slug/delete', (req, res, next) => {
  let slug = req.params.slug;
  Article.findOneAndDelete({ slug }, (err, article) => {
    if (err) return next(err);
    Comment.deleteMany({ articleId: article._id }, (err, comment) => {
      if (err) return next(err);
    });
  });
});

module.exports = router;
