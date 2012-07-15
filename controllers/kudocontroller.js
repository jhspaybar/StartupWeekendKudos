exports.compose = function(req, res) {
  res.render('kudo/compose.jade', {
	  kudee: 'George Enescu'
  });
}


exports.submitPost = function(req, res) {
  
}

exports.submitGet = function(req, res) {  
  res.redirect('/profile');
}
