var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);
mongoose.connect('mongodb://127.0.0.1/canvass');


var userModelSchema = require('../models/users');
var questionModelSchema = require('../models/questions');
var answerModelSchema = require('../models/answers');

var User = mongoose.model('User', userModelSchema);
var Question = mongoose.model('Question', questionModelSchema);
var Answer = mongoose.model('Answer', answerModelSchema);

var exports = module.exports = {};

exports.register = function(req, res) {
	userReg(req.body).then(function(data){
		res.send(data);
	},function(e){
		res.send("error");
	});
};


var userReg = function(userParam) {
	var register = new User({firstName: userParam.fname, lastName: userParam.lname,
		email: userParam.email, password: userParam.pwd.hashCode(),status:1});
	return register.saveAsync();
};
