var User = require('../models/usermodel');
var Kudo = require('../models/kudomodel');
var async = require('async');

exports.compose = function(req, res) {
  res.render('kudo/compose.jade', {
	  kudee: 'George Enescu'
  });
}


exports.submitPost = function(req, res) {
  var privacy = (req.param('privacy', null) === 'public') ? 0 : 1;
  var toemail = req.param('to_email', null);
  var fromemail = req.param('from_email', null);
  var fromname = req.param('from_name', null);
  var message = req.param('message', null);
  var tags = req.param('tags', null);
  var creatorid;
  var targetid;
  
  async.parallel([
    function(callback) {
      User.findOne({email: toemail}, function(error, doc) {
        if(doc !== null) {
          targetid = doc._id;
          callback(null, doc._id);
        } else {
          var targetuser = new User({
            firstname: 'Kudo',
            lastname: 'User',
            email: toemail,
            password: '0',
            privacy: 0,
            autogen: true
          });
          targetuser.save( function(error) {
            if(error) {
              res.redirect('/');
            } else {
              targetid = targetuser._id;
              callback(null, targetuser._id);
            }
          });
        }
      });
    },
    function(callback) {
      if(req.session._id) {
        creatorid = req.session._id
        callback(null, req.session._id);
      } else {
        User.findOne({email: fromemail}, function(error, doc) {
          if(doc !== null && doc.autogen) {
            creatorid = doc._id;
            callback(doc._id);
          } else if(doc !== null && !doc.autogen) {
            res.redirect('/signin');
          } else {
            var namearray = fromname.split(/ (.+)?/)
            var first = namearray[0];
            var last = namearray.length > 1 ? namearray[1] : 'User';
            var creatoruser = new User({
              firstname: first,
              lastname: last,
              email: fromemail,
              password: '0',
              privacy: 0,
              autogen: true
            });
            creatoruser.save( function(error) {
              if(error) {
                res.redirect('/');
              } else {
                creatorid = creatoruser._id;
                callback(creatoruser._id);
              }
            });
          }
        });
      }
    }
  ], function(error, result) {
    var kudo = new Kudo({
      content: message,
      targetuser: targetid,
      creator: creatorid,
      date: new Date(),
      tags: tags,
      c_privacy: 0,
      t_privacy: privacy
    });
    kudo.save(function(error) {
      if(error) {
        console.log(error);
      } else {
        console.log(kudo);
      }
    });
  });
  /*
  async.series([
    function() {
      console.log('before firstfunc');
    },
    function() {
      async.parallel([
        function() {
          console.log('target parallel');
          User.findOne({email: toemail}, function(error, doc) {
            if(doc !== null) {
              targetid = doc._id;
              console.log('found doc for target');
            } else {
              var targetuser = new User({
                firstname: 'Kudo',
                lastname: 'User',
                email: toemail,
                password: '0',
                privacy: 0,
                autogen: true
              });
              targetuser.save( function(error) {
                if(error) {
                  console.log('target redir');
                  res.redirect('/');
                } else {
                  console.log('target made');
                  targetid = targetuser._id;
                }
              });
            }
          });
        },
        function() {
          console.log('creator parallel');
          if(req.session._id) {
            creatorid = req.session._id
            console.log('creator found');
          } else {
            User.findOne({email: fromemail}, function(error, doc) {
              if(doc !== null && doc.autogen) {
                creatorid = doc._id;
                console.log('creator auto found');
              } else if(doc !== null && !doc.autogen) {
                console.log('creator auto not found');
                res.redirect('/signin');
              } else {
                var namearray = fromname.split(/ (.+)?/)
                var first = namearray[0];
                var last = namearray.length > 1 ? namearray[1] : 'User';
                var creatoruser = new User({
                  firstname: first,
                  lastname: last,
                  email: fromemail,
                  password: '0',
                  privacy: 0,
                  autogen: true
                });
                creatoruser.save( function(error) {
                  if(error) {
                    res.redirect('/');
                  } else {
                    creatorid = creatoruser._id;
                  }
                });
              }
            });
          }
        }
      ]);
    },
    function() {
      console.log('after parallel');
      console.log(creatorid);
      console.log(targetid);
    },
    function() {
      var kudo = new Kudo({
        content: message,
        targetuser: targetid,
        creator: creatorid,
        date: new Date(),
        tags: tags,
        c_privacy: 0,
        t_privacy: privacy
      });
      console.log('made a kudo I hope?');
    }
  ], function(error, results) {
    console.log(error);
  });*/
  res.send('testing');
}

exports.submitGet = function(req, res) {  
  res.redirect('/profile');
}
