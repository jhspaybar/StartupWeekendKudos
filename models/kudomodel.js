var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var KudoSchema = new Schema({
  content: {type: String, required: true},
  targetuser: {type: String, required: true},
  creator: {type: String, required: true},
  date: {type: Date, required: true, index: true},
  c_privacy: {type: Number},
  t_privacy: {type: Number},
  tags: {type: Array, required: false}
});

module.exports = mongoose.model('Kudo', KudoSchema);