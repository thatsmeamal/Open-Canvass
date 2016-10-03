var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create a schema
var AnswerSchema = new Schema({
  answer: String,
  quesId: String,
  email: String,               //for storing the id of the user answering the question
  postedDate: String,            //Answer posted date
  likes: Number,
  comments: [{}]
});

module.exports = AnswerSchema;
console.log("@Answermodel.js")
