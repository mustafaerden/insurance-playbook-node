const express = require('express');
const router = express.Router();
const {userAuthenticated} = require('../../helpers/authentication');
const User = require('../../models/User');

function checkLogin(req, res, next) {
  if (!req.user){
    // if user is not logged-in redirect back to login page //
    req.flash('reg_success_message', 'Please login as an admin to access admin area!');
    res.redirect('/login');
  }else{
    next();
  }
}

// Admin paneline sadece isAdmin=true olan kullanıcı girmesi için;
function allowAdmin(req, res, next) {
  if (req.user.isAdmin === true) return next();
    req.flash('reg_success_message', 'You dont have permission to access admin area!');
    res.redirect('/'); 
}

router.use(checkLogin, allowAdmin);

//admin sayfalarının admin layoutunu kullanması için şu işlemi yapıyoruz;
router.all('/*',checkLogin, allowAdmin, userAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'admin';
  next();
});



// Admin Index Page;
router.get('/', (req, res) => {
  
    res.render('admin');

});











module.exports = router;