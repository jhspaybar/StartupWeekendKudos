var User = require('../models/usermodel.js');

exports.profile = function(req, res) {
  var id = req.param('_id') || req.session._id;
  User.findOne({_id: id}, function(err, user) {
    res.render('profile/index.jade', {
      id: id,
      title: 'Your Profile',
      firstname: user && user.firstname || 'Elizabeth',
      lastname: user && user.lastname || 'Chaddock',
      position: user && user.title || 'Developer',
      company: user && user.company || 'Amazon.com',
      geoloc: user && user.geoloc || 'Seattle, WA',
      photoref: user && user.photoref || '//www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg',
      twitter: 'twitter.com/johndoe',
      rating: '57',
      strength1: 'Leadership',
      strength2: 'Teamwork',
      strength3: 'Networking',
      photoref_1: '//cacm.acm.org/system/assets/0000/7989/51812.bbcnews.ruchi_sanghvi_facebook.large.jpg?1341312421&1337358501',
      kudo_text: 'Thanks for your help during Startup Weekend! I had so much fun working with you!',
      time_sent: '4:05 PM',
      time_sent2: '12:30 PM',
      time_sent3: '10:48 AM',
      name_0: 'Naomi K.',
      name_1: 'Liz C.',
      name_2: 'Colleen M.' 
   });
                  
  });
};
