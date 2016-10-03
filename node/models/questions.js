var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create a schema
var QuestionSchema = new Schema({
  question: {
    type: String,
    unique: true
  },
  userId: String,
  email: String,
  postedDate: String
});

module.exports = QuestionSchema;
console.log("@Questionmodel.js")
