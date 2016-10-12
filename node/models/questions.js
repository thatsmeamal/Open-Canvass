var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create a schema
var QuestionSchema = new Schema({
  question: {
    type: String,
    unique: true
  },
  userId: String,
  firstName: String,
  lastName: String,
  email: String,
  postedDate: String,
  bookmarks: []
});

module.exports = QuestionSchema;
console.log("@Questionmodel.js")
