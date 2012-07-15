var User = require('../models/usermodel.js');

exports.profile = function(req, res) {
  console.log(req.param('_id'));
  User.findOne({_id: req.param('_id')}, function(err, user) {
    res.render('profile/index.jade', {
      title: 'Your Profile',
      firstname: user && user.firstname || 'John',
      lastname: user && user.lastname || 'Doe',
      position: 'Developer',
      company: 'Amazon.com',
      geoloc: 'Seattle, WA',
      photoref: user && user.photoref || 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg',
      twitter: 'twitter.com/johndoe',
      rating: '57',
      strength1: 'Leadership',
      strength2: 'Teamwork',
      strength3: 'Networking'
    });
                  
  });
} 
