var mongoose = require('mongoose');

class DB{
    constructor(){
        mongoose
        .connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })
        .then(() => {
            console.log('Connected to Database');
        })
        .catch(err => {
            console.log('Not Connected to Database ERROR! ', err);
        });
    }

}
module.exports = DB;