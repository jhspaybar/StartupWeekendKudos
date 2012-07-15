exports.profile = function(req, res) {
  res.render('profile/index.jade', {
    title: 'Your Profile',
    firstname: 'John',
    lastname: 'Doe',
    position: 'Developer',
    company: 'Amazon.com',
    geoloc: 'Seattle, WA',
    photoref: 'http://www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg',
    twitter: 'twitter.com/johndoe',
    rating: '57',
    strength1: 'Leadership',
    strength2: 'Teamwork',
    strength3: 'Networking'
    });
} 
