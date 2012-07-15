exports.home = function(req, res) {
  res.render('index', {title: 'KudoCast -- Give and Get Recognition!'});
}

exports.stream = function(req, res) {
  res.render('home', {title: 'KudoCast -- Give and Get Recognition!'});
}
