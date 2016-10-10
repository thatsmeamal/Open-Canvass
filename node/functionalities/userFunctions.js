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

exports.register = function(req, res) {
	userReg(req.body).then(function(data){
		res.send(data);
	},function(e){
		res.send("error");
	});
};

exports.check = function (req, res) {
	check(req.body).then(function(data){
		if(data.length === 0) {
			res.send("error");
		} else {
			res.send(data[0]);
		}
	});
};

exports.ask = function (req, res){
	saveQues(req.body).then(function(data){
		res.send(data);
	},function(e){
		res.send("error");
	});
};

exports.quesData = function (req, res){
	retrieveForum().then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.quesUser = function (req, res){
	var i = 0;
	retrieveUser(req.body).then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.answer = function (req, res){
	var i = 0;
	console.log(req.body);
	saveAnswer(req.body).then(function(data){
		res.send("success");
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.ansInfo = function (req, res){
	getAnswers().then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.users = function (req, res){
	getUser().then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.postLike = function (req, res){
	like(req.body).then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.postDislike = function (req, res){
	dislike(req.body).then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.postDelete = function (req, res){
	deletePost(req.body).then(function(data){
		getQuesId(req.body).then(function(ansData){
			res.send(ansData);
		},function(e){
			console.log(e.message);
			res.send("error");
	})},function(es){
		console.log(es.message);
		res.send("error");
	});
};

exports.answerEdit = function (req, res){
	editAnswer(req.body).then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.commentsGet = function (req, res){
	getComments(req.body).then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.commentAdd = function (req, res){
	addComment(req.body).then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.likedPost = function (req, res){
	isLiked(req.body).then(function(data){
		if(data.length === 0) {
			res.send("false");
		} else {
			res.send("true");
		}
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};

exports.commentDelete = function(req,res){
	deleteComment(req.body).then(function(data){
		res.send(data);
	},function(e){
		console.log(e.message);
		res.send("error");
	});
};



var userReg = function(userParam) {
	var register = new User({firstName: userParam.fname, lastName: userParam.lname,
		email: userParam.email, password: userParam.pwd.hashCode(),status:1});
	return register.saveAsync();
};

var getUser = function() {
	return User.findAsync();
}

var check = function(logParam) {
	return User.findAsync({email:logParam.email,password:logParam.pwd.hashCode()});

};


var saveQues = function(quesParam) {
	var postQues = new Question({question: quesParam.question, userId: quesParam.userId,
		firstName: quesParam.firstName, lastName: quesParam.lastName, email: quesParam.email,
		postedDate: quesParam.postedDate});
	return postQues.saveAsync();
}


var retrieveForum = function() {
	return Question.findAsync({},{},{sort:{_id:-1}});
}


var retrieveUser = function(id) {
	var i = 0;
	var tempId = [];
	for(i=0;i<id.length;i++) {
		tempId[i] = id[i].email;
	}
	return User.findAsync({email: {$in:tempId}});
}


var saveAnswer = function(ansParam) {
	var postAns = new Answer({answer: ansParam.answer,quesId: ansParam.quesId,
		email: ansParam.email, postedDate: ansParam.postedDate, likes: ansParam.likes,
		likedUsers: ansParam.likedUsers, comments: ansParam.comments});
	return postAns.saveAsync();
}

var getAnswers = function() {
	return Answer.findAsync();
};

var like = function(temp) {
	Answer.updateAsync(
		{answer:temp.answer},
		{$inc:{likes:1}, $push:{likedUsers: temp.email}}
	);
	return Answer.findAsync({answer:temp.answer});
};

var dislike = function(temp) {
	Answer.updateAsync(
		{answer:temp.answer},
		{$inc:{likes:-1}, $pull:{likedUsers:temp.email}}
	);
	return Answer.findAsync({answer:temp.answer});
};

var deletePost = function(user) {
	Answer.removeAsync({answer: user.answer});
	return Answer.findAsync();
};

var getQuesId = function(temp) {
	return Question.findAsync({question:temp.question},{_id:1});
};

var editAnswer = function(answer) {
	Answer.updateAsync(
		{answer: answer.old},
		{answer: answer.new}
	);
	return Answer.findAsync({answer:answer.new});
};

var addComment = function(temp) {
	var commentData = {
		name: temp.name,
		date: temp.date,
		comment: temp.comment,
		email: temp.email
	};
	Answer.updateAsync(
		{answer: temp.answer},
		{$push: {comments: commentData}}
	);
	return Answer.findAsync({answer:temp.answer});
};

var getComments = function(temp) {
	return Answer.findAsync({answer: temp.answer});
};

var isLiked = function(temp) {
	return Answer.findAsync({answer: temp.answer, likedUsers: temp.email},{likedUsers:1, _id:0});
};

var deleteComment = function(temp) {
	var commentData = {
		comment: temp.comment,
		answer: temp.answer
	};
	Answer.updateAsync(
		{answer: temp.answer},
		{$pull: {comments: {comment: temp.comment}}}
	);
	return Answer.findAsync({answer:temp.answer});
};


String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}
