const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const Question = require('../../models/Question');


//admin sayfalarının admin layoutunu kullanması için şu işlemi yapıyoruz;
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});


//Admin/Questions Index;
router.get('/', (req, res) => {

  Question.find({}).populate('category').then(questions => {

    res.render('admin/questions', {
      questions: questions
    });

  });



});

//Admin/Questions/Create;
router.get('/create', (req, res) => {

  Category.find({}).then(categories => {

    res.render('admin/questions/create', {
      categories: categories
    });

  });

});

//Admin/Questions/Create/Post ile question oluşturma;
router.post('/create', (req, res) => {

  let errors = [];

  if (!req.body.category) {
    errors.push({text: 'Please choose a Category!'});
  }

  if (!req.body.title) {
    errors.push({text: 'Please add a Question!'});
  }

  if (!req.body.answer) {
    errors.push({text: 'Please add an Answer!'});
  }

  if (errors.length > 0) {
    res.render('admin/questions/create', {
      errors: errors
    });
  } else {

    const newQuestion = new Question({
      category: req.body.category,
      title: req.body.title,
      answer: req.body.answer
    });

    newQuestion.save().then(savedQuestion => {
      req.flash('success_message', 'Question created successfully.');
      res.redirect('/admin/questions');
    }).catch(error => {
      console.log('Couldnt saved the question');
    });




  }

});

// Question Edit sayfası;
router.get('/edit/:id', (req, res) => {

  Question.findOne({_id: req.params.id}).populate('category').then(question => {

    Category.find({}).then(categories => {

      res.render('admin/questions/edit', {
        question: question,
        categories: categories
      });

    });

  });

});

// Question Edit put ile update işlemi;
router.put('/edit/:id', (req, res) => {

  Question.findOne({_id: req.params.id}).then(question => {

    question.category = req.body.category
    question.title = req.body.title
    question.answer = req.body.answer

    question.save(updatedQuestion => {
      req.flash('success_message', 'Question updated successfully.');
      res.redirect('/admin/questions');
    });

  });

});

// Question Delete İşlemi;
router.delete('/delete/:id', (req, res) => {

  Question.findOne({_id: req.params.id}).then(question => {

    question.remove().then(questionRemoved => {
      req.flash('success_message', 'Question deleted successfully.');
      res.redirect('/admin/questions');
    });

  });

});






module.exports = router;
