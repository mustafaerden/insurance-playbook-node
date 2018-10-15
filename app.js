const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const { mongoDbUrl } = require('./config/database');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const bcrypt = require('bcryptjs');


const app = express();

const User = require('./models/User');

//Mongoose Database Bağlantısı;
mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
mongoose.set('useCreateIndex', true);



//Handlebars-Helpers;
const { generateTime } = require('./helpers/handlebars-helpers');
// Handlebars;
app.engine('handlebars', exphbs({
  defaultLayout: 'home',
  helpers: {generateTime: generateTime}
}));
app.set('view engine', 'handlebars');

//Body Parser;
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//Method Override(update-delete metodu için put);
app.use(methodOverride('_method'));

//Public dosyalarını dahil et;
app.use(express.static(path.join(__dirname, 'public')));

//Express-Session Middleware;
app.use(session({
  secret: 'mustafaerden123',
  resave: true,
  saveUninitialized: true
}));

//Passport;
app.use(passport.initialize());
app.use(passport.session());

//Connect-Flash Middleware;
app.use(flash());
app.use((req, res, next) => {
  //kullanıcı giriş yaptığında kullanıcı bilgisini viewlerde çekmek için global variable oluşturuyoruz;
  res.locals.user = req.user || null;
  res.locals.success_message = req.flash('success_message');
  res.locals.reg_success_message = req.flash('reg_success_message');
  res.locals.delete_message = req.flash('delete_message');
  //passport tan gelen message ları göstermek için;
  res.locals.error = req.flash('error');
  next();
});

// Load Routes;
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const categories = require('./routes/admin/categories');
const questions = require('./routes/admin/questions');
const agents = require('./routes/admin/agents');

// Use Routes;
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/categories', categories);
app.use('/admin/questions', questions);
app.use('/admin/agents', agents);

const port = process.env.PORT || 5000;

app.listen(port, () => {

  // Generate admin user before start listening app

  const adminUser = new User({
    email: 'mustafaerden87@gmail.com',
    password: '123456',
    firstname: 'Mustafa',
    lastname: 'Erden',
    isAdmin: true,
  });

  if (adminUser) {
    console.log('adminUser already existed');
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(adminUser.password, salt, (err, hash) => {
        adminUser.password = hash;
        adminUser.save().then(savedUser => {
          console.log('Admin user created!');
        });
      });
    });
  }

  console.log(`Listenin on port ${port}`);

});
