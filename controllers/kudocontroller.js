exports.compose = function(req, res) {
  res.render('kudo/compose.jade', {
	  kudee: 'George Enescu'
  });
}


exports.submitPost = function(req, res) {
  // Send data to DB here.
}

exports.submitGet = function(req, res) {  
  res.redirect('/profile');
}
