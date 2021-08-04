var express = require('express');
var router = express.Router();

var Product = require('../models/Product');
var auth = require('../middlewares/auth');

// GET new
router.get('/new', auth.isUserAndAdminLogged, (req, res, next) => {
  res.render('product');
});
// POST product
router.post('/', (req, res, next) => {
  Product.create(req.body, (error, result) => {
    if (error) return next(error);
    res.redirect('/products');
  });
});
// GET all product
router.get('/', (req, res, next) => {
  Product.find({}, (error, products) => {
    if (error) return next(error);
    res.render('products', { products });
  });
});

// GET product details
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
    Product.findById(id, (err, product) => {
      if (err) return next(err);
      const error = req.flash('error')[0];
      res.render('productDetails', { product, error});
    });
});
router.use(auth.isUserAndAdminLogged);
// likes
router.get('/:id/like', (req, res, next) => {
  const id = req.params.id;
    Product.findByIdAndUpdate(id, { $inc: { like: 1 } }, (error, product) => {
      if (error) return next(error);
      res.redirect('/products/' + product.id);
    });
});

// edit
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  Product.findById(id, (error, product) => {
    if (error) return next(error);
    res.render('editProduct', { product });
  });
});

// update
router.post('/:id/update', (req, res, next) => {
  const id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, (error, product) => {
    if (error) return next(error);
    res.redirect('/products/' + id);
  });
});
// delete
router.get('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id, (error, product) => {
    if (error) return next(error);
    res.redirect('/products');
  });
});
//sort by category
router.get('/:category/sortby', (req, res, next) => {
  let category = req.params.category;
  Product.find({category}, (error, products) => {
    if(error) return nex(error);
    res.render('products', { products })
  })
})

module.exports = router;
