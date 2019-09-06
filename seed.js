var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var data = [
  {
    name: 'Bridge Camp',
    image:
      'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    description: 'Camp With a Bridge'
  },
  {
    name: 'Wise Camp',
    image:
      'https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg',
    description: 'Camp Owned By Wise Man For Wise People'
  },
  {
    name: 'Cartoon Camp',
    image:
      'https://www.jotform.com/blog/wp-content/uploads/2019/03/1-Deciding-on-the-type-of-summer-camp-700x436.png',
    description: 'Go and Get a Life Camp'
  }
];

function seedDB(params) {
  //Remvoe Campgrounds
  Comment.remove({}, err => {
    if (err) console.log(err);
    if (!err) {
      Campground.remove({}, err => {
        if (err) {
          console.log(err);
        } else {
          console.log('Camps Removed');
          data.forEach(data => {
            Campground.create(data, (err, creeatedCamp) => {
              if (err) console.log(err);
              if (!err) {
                console.log('camp added');
                //create a Comment
                var newComment = {
                  text: 'This Place is Great',
                  author: 'Homer',
                  date: Date.now()
                };
                Comment.create(newComment, (err, createdComment) => {
                  if (err) console.log(err);
                  if (!err) {
                    creeatedCamp.comments.push(createdComment);
                    creeatedCamp.save();
                    console.log('Created new Comment');
                  }
                });
              }
            });
          });
        }
      });
    }
  });
}
module.exports = seedDB;
