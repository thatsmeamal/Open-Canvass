var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);


var userModelSchema = require('../models/users');
var questionModelSchema = require('../models/questions');
var answerModelSchema = require('../models/answers');

var User = mongoose.model('User', userModelSchema);
var Question = mongoose.model('Question', questionModelSchema);
var Answer = mongoose.model('Answer', answerModelSchema);

var exports = module.exports = {};

exports.batchUsers = function (req, res){
	usersBatch(req.body).then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.retrieveAllUsers = function (req, res){
	getAllUsers().then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.userDelete = function (req, res){
	deleteUser(req.body).then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};


var usersBatch = function(temp) {
	return User.findAsync({},{},{skip:temp.skip,limit:5});
};

var getAllUsers = function() {
	return User.findAsync();
};

var deleteUser = function(temp) {
	return User.removeAsync({email: temp.email});
};
