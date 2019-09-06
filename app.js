var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');
const port = 3000;
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
mongoose
  .connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Database');
  })
  .catch(err => {
    console.log('Not Connected to Database ERROR! ', err);
  });

//Schema Setup
var campgorundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description:String
});
var Campground = mongoose.model('Campground', campgorundSchema);
/* Campground.create(
 {
    name: 'Sea Camp',
    image:
      'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      description:"This is The Sea Camp With alot of Water and Subtle Bitches"
  }
,(err,Campground)=>{
  if(err){ console.log(err);}else{
  console.log("Newly Created Campground");
  console.log(Campground);
  }
}); */

app.get('/', (req, res) => res.render('landing'));
app.get('/campgrounds', (req, res) => {
  //get Campgrounds from DB
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { campgrounds });
    }
  });
});
app.post('/campgrounds', (req, res) => {
  var { name, image,description } = req.body;
  //create New Campground and Save It To DB
  
  Campground.create(
    {
      name: name,
      image:image,
      description:description
    },
    (err, Campground) => {
      if (err) {
        console.log(err);
      } else {
       console.log(Campground);
        res.redirect('/campgrounds');
      }
    }
  );

});
app.get('/campgrounds/add', (req, res) => {
  res.render('newcamp');
});
app.get('/campgrounds/:id',(req,res)=>{
  Campground.findById(req.params.id,(err,campground)=>{
    if(err){console.log(err);}else{
    res.render('show', { campground });
    }
  });

})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.get('*', (req, res) => {
  res.send('Cant Find Page You Requested');
});
