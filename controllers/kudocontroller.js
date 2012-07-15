var User = require('../models/usermodel');
var Kudo = require('../models/kudomodel');
var async = require('async');
var redisPub;
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  redisPub = require("redis").createClient(rtg.port, rtg.hostname);

  redisPub.auth(rtg.auth.split(":")[1]);
} else {
  redisPub = require("redis").createClient();
}

exports.list = function(req, res) {
  Kudo.find({}).sort('date', -1).slice([0,10]).exec( function(error, docs) {
    console.log(docs);
  });
  res.send('test');
}

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
              console.log(error);
              //res.redirect('/');
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
            console.log(error);
            //res.redirect('/signin');
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
                console.log(error);
                //res.redirect('/');
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
        var cuser = User.findOne({_id: kudo.creator}, function(error, doc) {
          
          var message = '<div class="row"><div class="kudopicturespan">' +
          '<img src="https://cacm.acm.org/system/assets/0000/7989/51812.bbcnews.ruchi_sanghvi_facebook.large.jpg?1341312421&1337358501" height="60px" width="60px" class="picture recommender_picture"></div>' +
          '<div class="shoutoutspan"><div class="shoutout" style="margin: 0 0 0 0; width: 200%;">' + kudo.content + '</div></div></div>'+
          '<div class="row"><div class="creator">' + doc.firstname + ' ' + doc.lastname[0].toUpperCase() + '.</div>'+
          '<div class="date">Sent July 15</div></div>';
          redisPub.publish('kudostream', message);
        });
      }
    });
  });
  res.send('testing');
}
