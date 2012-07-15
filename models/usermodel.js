var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  cellphone: {type: String, required: false},
  title: {type: String, required: false},
  company: {type: String, required: false},
  geoloc: {type: String, required: false},
  photoref: {type: String, required: false},
  twitter: {type: String, required: false},
  linkedin: {type: String, required: false},
  privacy: {type: Number, required: true}
});

UserSchema.virtual('name').get(function() {
  return this.firstname + ' ' + this.lastname;
});

module.exports = mongoose.model('User', UserSchema);