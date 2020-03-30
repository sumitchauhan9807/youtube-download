const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
 
const UserSchema = new Schema({
  
  name: String,
  email:String,
  password:String
});
const userModel = mongoose.model('User', UserSchema);

module.exports  = userModel