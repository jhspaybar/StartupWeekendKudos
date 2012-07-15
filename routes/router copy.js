var rootController = require('../controllers/rootcontroller');
var profileController = require('../controllers/profilecontroller');
var signinController = require('../controllers/signincontroller');
var kudoController = require('../controllers/kudocontroller');

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
  app.get('/stream', rootController.stream);
  
  //Profile Paths
  app.get('/profile', profileController.profile);
  
  // Kudo creation paths:
  app.get('/kudo/compose', kudoController.compose);
  app.post('/kudo/submit', kudoController.submit);
  app.get('/kudo/submit', kudoController.submitGet);

  // Signup Paths
  app.get('/signin', signinController.signinGet);
  app.get('/signup', signinController.signinGet);
  app.post('/signin', signinController.signinPut);
  app.post('/signup', signinController.signinPost);
  app.get('/signout', signinController.signinDel);
}
