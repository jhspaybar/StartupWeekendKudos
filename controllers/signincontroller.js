var sys = require('sys');

exports.signinGet = function(req, res) {
  res.render('signin/index', {title: 'Sign up now!'});
}

exports.signinPost = function(req, res) {
  console.log(req.param('name', null));
  res.redirect('/');
}

exports.signinPut = function(req, res) {
  console.log('put');
  res.redirect('/');
}
