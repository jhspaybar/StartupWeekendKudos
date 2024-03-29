var User = require('../models/usermodel');
var bcrypt = require('bcrypt');

exports.signinGet = function(req, res) {
  res.render('signin/index', {title: 'Sign up now!',
                              signup: req.originalUrl === '/signup'});
};

exports.signinPost = function(req, res) {
  var afterHash = function(error, hash) {
    User.findOne({email: req.param('email')}, function(err, user) {
      if (user && !user.autogen) {
        res.render('signin/index', {title: 'Sign up now!',
                                    signup: true,
                                    error: 'Account with that email already exists.'});
        return;
      }
      var userHash = {firstname: req.param('firstname'),
                      lastname: req.param('lastname'),
                      email: req.param('email'),
                      password: hash,
                      privacy: 0,
                      autogen: false};
      if (req.param('cellphone')) {
        userHash.cellphone = req.param('cellphone');
      }
      if (user) {
        User.update({email: req.param('email')}, userHash);
      } else {
        user = new User(userHash);
      }
      user.save(function(err, saved) {
        if (err) {
          res.render('signin/index', {title: 'Sign up now!',
                                      signup: true,
                                      error: 'Credentials incorrect.'});
        } else {
          req.session.regenerate(function(err) {
            req.session.user = saved.email;
            req.session._id = saved.id;
            req.session.firstname = saved.firstname;
            req.session.lastname = saved.lastname;
            req.session.email = saved.email;
            console.log('User created successfully');
            res.redirect('/linkin');
          });
        }
      });
    });
  };
  if (req.param('password') === req.param('password2') &&
      req.param('password').length > 0) {
    bcrypt.hash(req.param('password'), 12, afterHash);
  } else {
    res.render('signin/index', {title: 'Sign up now!',
                                signup: true,
                                error: 'Password too short or did not match.'});
  }
};

exports.signinPut = function(req, res) {
  var address = req.param('email');
  var pw = req.param('password');
  var hadError = false;
  var responseVars = {title: 'Sign in',
                      signup: false,
                      error: 'Improper login credentials.'};

  User.findOne({email: address}, function(err, user) {
    if (!err && user && !user.autogen) {
      bcrypt.compare(pw, user.password, function(err, matched) {
        if (!err && matched) {
          req.session.regenerate(function(err) {
            req.session.user = user.email;
            req.session._id = user.id;
            req.session.firstname = user.firstname;
            req.session.lastname = user.lastname;
            req.session.email = user.email;
            if (user.linkedin) {
              res.redirect('/profile');
            } else {
              res.redirect('/linkin');
            }
          });
          return;
        }
        res.render('signin/index', responseVars);
      });
    } else if (user && user.autogen) {
      responseVars.error = 'Please create an account with KudoCast to log in.';
      res.render('signin/index', responseVars);
    } else {
      res.render('signin/index', responseVars);
    }
  });
};

exports.signinDel = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};

exports.linkinGet = function(req, res) {
  if (req.session._id) {
    var user = User.findOne({_id: req.session._id});
    if (user) {
      if (user.linkedin) {
        res.redirect('/profile/' + user._id);
      } else {
        res.render('signin/linkin', {title: 'Link with LinkedIn'});
      }
      return;
    }
  }
  res.redirect('/signin', {title: 'Sign up now!',
                           signup: true});
};

exports.linkinPost = function(req, res) {
  if (req.session._id) {
    console.log('updating linked in info');
    User.findOne({_id: req.session._id}, function(err, user) {
      user.photoref = req.param('pictureUrl').replace('http:', '');
      user.linkedin = req.param('linkedInID');
      user.geoloc = req.param('location');
      user.title = req.param('title');
      user.company = req.param('company');
      user.save(function(err, saved) {
        // TODO: Handle error
      });
    });
  }
  res.redirect('/profile');
};


function getCookie(allCookies, name) {
  var cookies = allCookies.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var parts = cookies[i].split('=');
    if (parts[0].trim() === name) {
      return parts[1];
    }
  }
  return null;
}
