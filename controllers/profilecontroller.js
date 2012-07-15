exports.profile = function(req, res) {
  res.render('profile/index.jade', {
    title: 'Your Profile',
    firstname: 'Elizabeth',
    lastname: 'Chaddock',
    position: 'Developer',
    company: 'Amazon.com',
    geoloc: 'Seattle, WA',
    photoref: 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg',
    twitter: 'twitter.com/johndoe',
    rating: '57',
    strength1: 'Leadership',
    strength2: 'Teamwork',
    strength3: 'Networking',
    photoref_1: 'http://cacm.acm.org/system/assets/0000/7989/51812.bbcnews.ruchi_sanghvi_facebook.large.jpg?1341312421&1337358501',
    kudo_text: 'Thanks for your help during Startup Weekend!'
    });
} 
