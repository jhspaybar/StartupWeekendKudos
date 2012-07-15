var User = require('../models/usermodel.js');
var bcrypt = require('../node_modules/bcrypt/bcrypt.js');

exports.signinGet = function(req, res) {
  res.render('signin/index', {title: 'Sign up now!',
                              signup: req.originalUrl === '/signup'});
};

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
                                    error: 'Credentials incorrect'});
      } else {
        req.session.regenerate(function(err) {
          req.session.user = saved.email;
          req.session._id = saved.id;
          console.log('User created successfully');
          res.redirect('/linkin');
        });
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
};

exports.signinPut = function(req, res) {
  var address = req.param('email');
  var pw = req.param('password');
  var hadError = false;
  var responseVars = {title: 'Sign in',
                      signup: false,
                      error: 'Improper login credentials'};

  User.findOne({email: address}, function(err, user) {
    if (!err && user) {
      bcrypt.compare(pw, user.password, function(err, matched) {
        if (!err) {
          req.session.regenerate(function(err) {
            req.session.user = user.email;
            req.session._id = user.id;
            res.redirect('/linkin');
          });
          return;
        }
        res.render('signin/index', responseVars);
      });
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
    console.log(req.param('linkedInID'));
    User.findOne({_id: req.session._id}, function(err, user) {
      user.photoref = req.param('pictureUrl');
      user.linkedin = req.param('linkedInID');
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
