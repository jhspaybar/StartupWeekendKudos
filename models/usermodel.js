var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  cellphone: {type: String, required: true},
  company: {type: String, required: true},
  geoloc: {type: String, required: true},
  photoref: {type: String, required: true},
  twitter: {type: String, required: true},
  linkedin: {type: String, required: true},
  privacy: {type: Number, required: true}
});

UserSchema.virtual('name').get(function() {
  return this.firstname + ' ' + this.lastname;
});

module.exports = mongoose.model('User', UserSchema);