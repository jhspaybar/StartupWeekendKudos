var Kudo = require('../models/kudomodel');
var User = require('../models/usermodel');

exports.home = function(req, res) {
  Kudo.find({}).sort('date', -1).slice([0,10]).exec( function(error, docs) {
    var recentKudos = [];
    for (var i = 0; i < Math.min(10, docs.length); i++) {
      var newKudo = {};
      newKudo.content = docs[i].content;
/*      User.findOne({_id: docs[i].creator}, function(err, user) {
        newKudo.creator = user.name;
        User.findOne({_id: docs[i].targetuser}, function(err, user) {
          newKudo.photo = '//www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg';
          newKudo.date = 'July 15';
          recentKudos.push(newKudo);
        });
      });*/
      newKudo.photo = '//www.almostsavvy.com/wp-content/uploads/2011/04/profile-photo.jpg';
      newKudo.date = 'July 15';
      newKudo.creator = 'Melissa Winstanley';
      recentKudos.push(newKudo);
    }

    console.log(recentKudos);
    res.render('index', {title: 'KudoCast -- Give and Get Recognition!',
                         recent: recentKudos});
  });
};


exports.stream = function(req, res) {
  res.render('home', {title: 'KudoCast -- Give and Get Recognition!'});
}
