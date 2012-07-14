var sys = require('sys');

exports.signinGet = function(req, res) {
  res.render('signin/index', {title: 'Sign up now!',
                              signup: req.originalUrl === '/signup' });
}

exports.signinPost = function(req, res) {  
  res.redirect('/profile');
}

exports.signinPut = function(req, res) {
  console.log('put');
  res.redirect('/profile');
}
