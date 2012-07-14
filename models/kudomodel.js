var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var KudoSchema = new Schema({
  content: {type: String, required: true},
  targetUser: {type: String, required: true},
  creator: {type: String, required: true},
  date: {type: Date, required: true},
  c_privacy: {type: Number},
  t_privacy: {type:: Number},
  tags: {type: Array}
});

module.exports = mongoose.model('Kudo', KudoSchema);