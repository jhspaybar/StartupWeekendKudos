var Kudo = require('../models/kudomodel');
var User = require('../models/usermodel');
var async = require('async');

exports.home = function(req, res) {
  Kudo.find({}).sort('date', -1).slice([0,10]).exec( function(error, docs) {
    var recentKudos = [];
    async.forEach(docs, function(doc, callback) {
      var newKudo = {};
      newKudo.content = doc.content;
      User.findOne({_id: doc.creator}, function(err, user) {
        console.log(user);
        User.findOne({_id: doc.targetuser}, function(err, user) {
                      console.log(user);
          newKudo.photo = user.photoref || '/image/profile-photo.png';
          newKudo.creator = user.firstname;
          newKudo.date = 'July 15';
          recentKudos.push(newKudo);
          callback(null, 0);
        });
      });
    }, function(err) {
      console.log(recentKudos);
      res.render('index', {title: 'Recognize.com -- Give and Get Recognition!',
                           recent: recentKudos});
      
    });
  });
};


exports.stream = function(req, res) {
  res.render('home', {title: 'KudoCast -- Give and Get Recognition!'});
}
