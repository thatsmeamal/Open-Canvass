var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create a schema
var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
      type:String,
      unique:true
  },
  password: String,
  status: Number
});

module.exports = UserSchema;
console.log("@Usermodel.js")
