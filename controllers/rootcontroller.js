exports.home = function(req, res) {
  res.render('index', {title: 'Recognize.com -- Give and Get Recognition!'});
}

exports.stream = function(req, res) {
  res.render('home', {title: 'Recognize.com -- Give and Get Recognition!'});
}
