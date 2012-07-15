var rootController = require('../controllers/rootcontroller');
var profileController = require('../controllers/profilecontroller');
var signinController = require('../controllers/signincontroller');

module.exports = function(app) {
  app.get('*', function(req, res, next) {
    if(req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === 'http') {
      res.redirect('https://' + req.headers.host + req.url);
    } else {
      next();
    }
  });
  
  //Root Paths
  app.get('/', rootController.home);
  
  //Profile Paths
  app.get('/profile', profileController.profile);
  app.get('/profile/:_id', profileController.profile);

  // Signup Paths
  app.get('/signin', signinController.signinGet);
  app.get('/signup', signinController.signinGet);
  app.post('/signin', signinController.signinPut);
  app.post('/signup', signinController.signinPost);
  app.get('/signout', signinController.signinDel);
  app.get('/linkin', signinController.linkinGet);
  app.post('/linkin', signinController.linkinPost);
};
