var User = require('../models/usermodel.js');
var bcrypt = require('../node_modules/bcrypt/bcrypt.js');

exports.signinGet = function(req, res) {
  res.render('signin/index', {title: 'Sign up now!',
                              signup: req.originalUrl === '/signup',
                              error: undefined});
}

exports.signinPost = function(req, res) {
  var afterHash = function(error, hash) {
    var userHash = {firstname: req.param('firstname'),
                    lastname: req.param('lastname'),
                    email: req.param('email'),
                    password: req.param('password'),
                    privacy: 0};
    if (req.param('cellphone')) {
      userHash.cellphone = req.param('cellphone');
    }
    var user = new User(userHash);
    user.save(function(err, saved) {
      if (err) {
        res.render('signin/index', {title: 'Sign up now!',
                                    signup: true,
                                    error: err});
      } else {
        req.session.user = saved.email;
        req.session.id = saved._id;
        console.log('User created successfully');
        res.redirect('/profile');
      }
    });
  };
  if (req.param('password') === req.param('password2') &&
      req.param('password').length > 0) {
    bcrypt.hash(req.param('password'), 12, afterHash);
  } else {
    res.render('signin/index', {title: 'Sign up now!',
                                signup: true,
                                error: 'Password too short or did not match'});
  }
}

exports.signinPut = function(req, res) {
  var address = req.param('email');
  var pw = req.param('password');
  var hadError = false;
  /*
  User.findOne({email: address}, function(err, user) {
    if (!err && user) {
      bcrypt.compare(pw, user.password, function(err, matched) {
        if (err) {
          hadError = true;
        } else {
          req.session.user = user.email;
          req.session.id = user._id;
        }
      });
    } else {
      hadError = true;
    }
  });*/
  var responseVars = {title: 'Sign in',
                      signup: false};
  if (hadError) {
    responseVars.error = 'Improper login credentials';
  }
  res.render('signin/index', responseVars);
}

exports.signinDel = function(req, res) {
  req.session._id = undefined;
  res.redirect('/');
}