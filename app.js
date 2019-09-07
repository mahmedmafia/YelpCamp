var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  passport = require('passport'),
   LocalStrategy = require('passport-local').Strategy,
  seedDb = require('./seed'),
  DB = require('./db'),
  Comment = require('./models/comment'),
  Campground = require('./models/campground'),
  User = require('./models/user');

const port = 3000;
var db = new DB();
app.use(
  '/bootcss',
  express.static(__dirname + '/node_modules/bootstrap/dist/css')
);
app.use(
  '/bootjs',
  express.static(__dirname + '/node_modules/bootstrap/dist/js')
);
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Passport Configuration

app.use(
  require('express-session')({
    secret: 'Yelpoo',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

app.get('/', (req, res) => res.render('landing'));
app.get('/campgrounds', (req, res) => {
  //get Campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});
app.post('/campgrounds', (req, res) => {
  var { name, image, description } = req.body;
  //create New Campground and Save It To DB
  var newCamp = { name: name, image: image, description: description };
  Campground.create(newCamp, (err, Campground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(Campground);
      res.redirect('/campgrounds');
    }
  });
});
app.get('/campgrounds/add', (req, res) => {
  res.render('newcamp');
});
app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec((err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', { campground });
      }
    });
});
app.get('/campgrounds/:id/comments/new', (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) console.log(err);
    if (!err) {
      res.render('comments/new', { campground });
    }
  });
});

app.post('/campgrounds/:id/comments', (req, res) => {
  Campground.findById(req.params.id, (err, foundCamp) => {
    if (err) console.log(err);
    if (!err) {
      var { author, text } = req.body;
      var newComment = { author: author, text: text, date: Date.now() };
      Comment.create(newComment, (err, createdComment) => {
        if (err) console.log(err);
        if (!err) {
          foundCamp.comments.push(createdComment);
          foundCamp.save();
          res.redirect('/campgrounds/' + req.params.id);
          console.log(foundCamp.populate('comments'));
        }
      });
    }
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res,next) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('/register');
    } else {
      console.log(user);
      passport.authenticate('local', (err, user, info) => {
        console.log(err, user, info);
      });
      res.redirect('/campgrounds');
    }
  });
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.post(
  '/login',
  passport.authenticate('local'),
  (req, res) => {
    res.redirect('/')
  }
);
app.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/campgrounds');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.get('*', (req, res) => {
  res.send('Cant Find Page You Requested');
});
