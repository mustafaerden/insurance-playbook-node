const express = require('express');
const router = express.Router();
const AskQuestion = require('../../models/AskQuestion');
const User = require('../../models/User');

//admin sayfalarının admin layoutunu kullanması için şu işlemi yapıyoruz;
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});


//isAdmin: false olan kullanıcıları admin panelde gösteriyoruz;
router.get('/', (req, res) => {
  User.find({isAdmin: false}).then(agents => {
    res.render('admin/agents', {
      agents: agents
    });
  });
});

//Kullanıcıları admin panelde siliyoruz;
router.delete('/:id', (req, res) => {

  User.findOne({_id: req.params.id}).then(user => {
    user.remove().then(removedUser => {
      req.flash('success_message', 'User deleted successfully.');
      res.redirect('/admin/agents');
    })
  })

});


// Userların sordugu soruları admin panele çekiyoruz;
router.get('/questions', (req, res) => {
  AskQuestion.find({}).populate({ path: 'user', select: 'firstname' }).then(askedQuestions => {
    res.render('admin/agents/questions', {
      askedQuestions: askedQuestions
    });
  });
});


// AskQuestion Delete İşlemi;
router.delete('/questions/:id', (req, res) => {
  AskQuestion.findOne({_id: req.params.id}).then(askQuestion => {
    askQuestion.remove().then(askQuestionRemoved => {
      req.flash('success_message', 'Question deleted successfully.');
      res.redirect('/admin/agents/questions');
    });
  });
});




module.exports = router;
