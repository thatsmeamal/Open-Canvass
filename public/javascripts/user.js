var express = require('express');
var app = express();
var router = express.Router();

var adminFunctions = require('../../node/functionalities/adminFunctions');

var userFunctions = require('../../node/functionalities/userFunctions');

console.log("Starting...");

router.post('/usersbatch', adminFunctions.batchUsers);

router.get('/getallusers', adminFunctions.retrieveAllUsers);

router.post('/deleteuser', adminFunctions.userDelete);

router.post('/register', userFunctions.register);

router.post('/enter', userFunctions.check);

router.post('/ask', userFunctions.ask);

router.get('/quesdata', userFunctions.quesData);

router.post('/quesuser', userFunctions.quesUser);

router.post('/answer', userFunctions.answer);

router.get('/ansinfo', userFunctions.ansInfo);

router.get('/users', userFunctions.users);

router.post('/like', userFunctions.postLike);

router.post('/dislike', userFunctions.postDislike);

router.post('/deletepost', userFunctions.postDelete);

router.post('/editAnswer', userFunctions.answerEdit);

router.post('/getcomments', userFunctions.commentsGet);

router.post('/addcomment', userFunctions.commentAdd);

router.post('/isliked', userFunctions.likedPost);

router.post('/deletecomment', userFunctions.commentDelete);

module.exports = router;
