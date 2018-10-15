const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');


//admin sayfalarının admin layoutunu kullanması için şu işlemi yapıyoruz;
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});


// Admin/Categories/Index;
router.get('/', (req, res) => {
  Category.find({}).then(categories => {
    res.render('admin/categories', {
      categories: categories
    });
  });
  
});

//Admin/Categories/Create;
router.get('/create', (req, res) => {

  res.render('admin/categories/create');

});

// Admin/Categories/Create/Post;
router.post('/create', (req, res) => {

  let errors = [];

  if (!req.body.name) {
    errors.push({text: 'Please enter a category name!'});
  }
  
  if (errors.length > 0) {
    res.render('admin/categories/create', {
      errors: errors
    });
  } else {
    
    const newCategory = new Category({
      name: req.body.name
    });

    newCategory.save().then(savedCategory => {
        req.flash('success_message', 'Category created successfully.');
        res.redirect('/admin/categories');
      }).catch(error => {
        console.log('couldnt save the category');
      });

  }

});

// Admin/Categories/Edit Get metodu;
router.get('/edit/:id', (req, res) => {

  Category.findOne({_id: req.params.id}).then(category => {
    res.render('admin/categories/edit', {
      category: category
    });
  });

});

// Admin/Categories/Edit Put it update ediyoruz;
router.put('/edit/:id', (req, res) => {

  Category.findOne({_id: req.params.id}).then(category => {
    
    category.name = req.body.name
    category.save().then(updatedCategory => {

      req.flash('success_message', 'Category updated successfully.');
      res.redirect('/admin/categories');

    });
  })

});


// Category Delete işlemi;
router.delete('/delete/:id', (req, res) => {

  Category.deleteOne({_id: req.params.id}).then(result => {

    req.flash('success_message', 'Category deleted successfully.');
    res.redirect('/admin/categories');

  });

});










module.exports = router;