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

  // Signup Paths
  app.get('/signin', signinController.signinGet);
  app.post('/signin', signinController.signinPost);
  app.post('/signup', signinController.signinPut);
}
