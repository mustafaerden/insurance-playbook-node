const express = require('express');
const router = express.Router();
const Question = require('../../models/Question');
const Category = require('../../models/Category');
const User = require('../../models/User');
const AskQuestion = require('../../models/AskQuestion');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;



//home sayfalarının home layoutunu kullanması için şu işlemi yapıyoruz;
router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'home';
  next();
});

// Index Page;
router.get('/', (req, res) => {

  Category.find({}).then(categories => {

    res.render('home', {
      categories: categories
    });

  });

});

// Categoriye gore question ları listeleme;
router.get('/category/:slug', (req, res) => {
  Category.find({}).then(categories => {
    Category.findOne({slug: req.params.slug}).then(category => {
      Question.find({category: category.id}).populate('category').then(questions => {
        res.render('home/category', {
          categories: categories,
          category: category,
          questions: questions
        });
      });
    });
  });
});

// Ask question get sayfası;
router.get('/askquestion', (req, res) => {
    res.render('home/askquestion');
});

// Ask question post ile kayıt işlemi;
router.post('/askquestion', (req, res) => {

  let userErrors = [];

  if (!req.body.title) {
    userErrors.push({userMessage: 'Please add a Question!'});
  }

  if (!req.body.details) {
    userErrors.push({userMessage: 'Please add your details!'});
  }

  if (userErrors.length > 0) {
    res.render('home/askquestion', {
      userErrors: userErrors
    });
  } else {

    if (!req.user){
      // if user is not logged-in redirect back to login page //
      req.flash('reg_success_message', 'Please login to be able to ask a question !');
      res.redirect('/login');
    } else{

      const newAskQuestion = new AskQuestion({
        user: req.user,
        title: req.body.title,
        details: req.body.details
      });
  
      newAskQuestion.save().then(savedAskQuestion => {
        req.flash('reg_success_message', 'Your Question sent successfully.');
        res.redirect('/');
      }).catch(error => {
        console.log('Couldnt sent the question');
      });

    }  

  }

});

// Login Sayfası;
router.get('/login', (req, res) => {

  res.render('home/login');

});

// Login kullanıcı giriş post işlemi;
passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done) => {
  //Match User;
  User.findOne({
    email:email  //girilen email database e kayılımı diye bakıyoruz
  }).then(user => {
    if (!user) { //eğer kullanıcı database de yoksa;
      return done(null, false, {message: 'No User Found !'});
    }

    //Match Password;
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message: 'Password Incorrect !'});
      }
    })
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', (req, res, next) => {

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);

});

// Logout İşlemi;
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Register Sayfası;
router.get('/register', (req, res) => {

  res.render('home/register');

});

// Register kullanıcı kayıt post işlemi;
  router.post('/register', (req, res) => {

    let userErrors = [];

    if (!req.body.firstname) {
      userErrors.push({userMessage: 'Please enter your first name!'});
    }

    if (!req.body.lastname) {
      userErrors.push({userMessage: 'Please enter your last name!'});
    }

    if (!req.body.email) {
      userErrors.push({userMessage: 'Please enter your email!'});
    }

    if (!req.body.password) {
      userErrors.push({userMessage: 'Please enter your password!'});
    }

    if (req.body.password !== req.body.confirmPassword) {
      userErrors.push({userMessage: 'Passwords do not match!'});
    }

    if(userErrors.length > 0){
      res.render('home/register', {
        userErrors: userErrors,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
      });
    } else {

      //Kullanıcının girdiği email daha önce kayıt olmuşmu kontrolü;
      User.findOne({email: req.body.email}).then(user => {
        if (user) {
          req.flash('reg_success_message', 'This email already registered. Please login!');
          res.redirect('/login');
        } else {

          const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash;
              newUser.save().then(savedUser => {
                req.flash('reg_success_message', 'Registered successfully. Please login now');
                res.redirect('/login');
              });
            });
          });

        }
      });

    }

  });






module.exports = router;
