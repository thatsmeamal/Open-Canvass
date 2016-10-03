var app = angular.module('canvass', ['ngRoute']);

app.controller('userController',['$http','$scope','$window','$location', function($http,$scope,$window,$location){
	var cntlr = this;

	cntlr.nav = 0;

	$scope.readActive = function() {
		cntlr.nav = 1;
	};

	$scope.answerActive = function() {
		cntlr.nav = 2;
	};

	$scope.isNav = function(s) {
		return cntlr.nav === s;
	};

	$scope.regUser = {
		fname: '',
		lname: '',
		email: '',
		pwd: '',
		confirmpwd: ''
	};

	$scope.logs = {
		email: '',
		pwd: ''
	};

	$scope.searchBar = {
		question: '',
		userId:'',
		email: '',
		postedDate: ''
	};

	cntlr.forumDetails = [];

	cntlr.ansData = [];

	cntlr.ansTemp = [];

	$scope.id = [];

	$scope.users = [];


	$scope.whereTo = function() {
    if(localStorage.email === "admin@admin.com") {
      $location.path('/admin').replace();
    } else {
      $location.path('/forum').replace();
    }
  };


	$scope.newUser = function(){
		var pwd= $scope.regUser.pwd;
		var confirmpwd = $scope.regUser.confirmpwd;
		if(pwd === confirmpwd){
			$http.post('/register', $scope.regUser).then(function(status){
				//console.log(status.data);
				if(status.data === "error") {
					console.log(status.data);
					bootbox.alert("Email ID is already registered");
					$scope.regUser = {
						fname: '',
						lname: '',
						email: '',
						pwd: '',
						confirmpwd: ''
					};
				}
				else {
					localStorage.userName = status.data.firstName;
					localStorage.lastName = status.data.lastName;
					localStorage.email = status.data.email;
					localStorage.userId = status.data._id;
					$location.path('/forum').replace();
				}
			});
		}
		else {
			bootbox.alert('Passwords do not match !!')
		}

	};


	$scope.logUser = function() {
		var email = $scope.logs.email;
		var pwd = $scope.logs.pwd;
		if(email === "admin@admin.com" && pwd === "admin"){
			localStorage.email = email;
			$location.path('/admin').replace();
		} else {
			$http.post('/enter',$scope.logs).then(function(status){
				if(status.data === "error") {
					bootbox.alert("Wrong Email id or Password");
					$scope.logs = {
						email: '',
						pwd: ''
					};
				} else {
					localStorage.userName = status.data.firstName;
					localStorage.lastName = status.data.lastName;
					localStorage.email = status.data.email;
					localStorage.userId = status.data._id;
					$location.path('/forum').replace();
				}
			});
		}
	};



	$scope.postQuestion = function() {
		if($scope.searchBar.question.length === 0) {
			alert("Blank Post !!!");
		} else {
			$scope.searchBar.userId = localStorage.userId;
			$scope.searchBar.email = localStorage.email;
			$scope.searchBar.postedDate = todaysDate();
			$http.post('/ask',$scope.searchBar).then(function(status){
				if(status.data === "error") {
					alert("Sorry, something went wrong.\nQuestion could not be posted")
				} else {
					alert('Your question will be posted shortly');
				}
				$scope.searchBar = {
					question: '',
					userId:'',
					email: '',
					postedDate: ''
				}
			});
		}
	};


	$scope.quesDetails = function() {
		var j='';
		$http.get('/quesdata').then(function(status){
			if(status.data === "error") {
				console.log("FORUM DATA CANNOT BE LOADED")
			} else {
				console.log("FORUM DATA LOADED");
				for(j=0;j<status.data.length;j++) {
					$scope.dets = {};											//These objects are references. Hence, they have to be initialised for each loop(a new object array reference for each loop). Else the values are stored in the same memory location.
					$scope.dets["questionId"] = status.data[j]._id
					$scope.dets["question"] =  status.data[j].question;
					$scope.dets["userId"] = status.data[j].userId;
					$scope.dets["email"] = status.data[j].email;
					$scope.dets["postedDate"] = status.data[j].postedDate;
					$scope.dets["firstName"] = '';
					$scope.dets["lastName"] = '';
					cntlr.forumDetails.push($scope.dets);
					$scope.mail = {};
					$scope.mail["email"] = status.data[j].email;
					$scope.id.push($scope.mail);
				};
				$scope.quesUser();
				$scope.user();
				console.log("Question Details-->",cntlr.forumDetails);
				cntlr.ansInfo();
			}
		});
	};

	$scope.quesUser = function() {
		var i = 0,
				j = 0;
		$http.post('/quesuser',$scope.id).then(function(userdet){
			for(j=0;j<cntlr.forumDetails.length;j++) {
				for(i=0;i<userdet.data.length;i++) {
					if(cntlr.forumDetails[j].email === userdet.data[0].email) {
						cntlr.forumDetails[j].firstName = userdet.data[0].firstName;
						cntlr.forumDetails[j].lastName = userdet.data[0].lastName;
					}
				}
			}
		});
	};

	$scope.user = function() {
		$http.get('/users').then(function(userDetails) {
			$scope.size = userDetails.data.length;
			for(k=0;k<userDetails.data.length;k++) {
				$scope.users.push(userDetails.data[k]);
			}
		});
	}


	cntlr.ansInfo = function() {
		var i = 0,
				j = 0,
				k = 0;
		$http.get('/ansinfo').then(function(status) {
			if(status.data === "error") {
				console.log("ANSWER DETAILS COULD NOT BE LOADED");
			} else {
				console.log("ANSWER DETAILS LOADED");
				console.log("Answer Details-->",status.data);
				for(i=0;i<cntlr.forumDetails.length;i++) {
					var flag=0;
					$scope.item = {};
					$scope.item["questionId"] = cntlr.forumDetails[i].questionId;
					$scope.item["question"] = cntlr.forumDetails[i].question;
					$scope.item["quesFname"] = cntlr.forumDetails[i].firstName;
					$scope.item["quesLname"] = cntlr.forumDetails[i].lastName;
					$scope.item["quesDate"] = cntlr.forumDetails[i].postedDate;
					cntlr.ansTemp = [];					//IMPORTANT
					for(j=0;j<status.data.length;j++) {
							if(cntlr.forumDetails[i].questionId === status.data[j].quesId) {
							$scope.ansItem = {};
							$scope.ansItem["answer"] = status.data[j].answer;
							$scope.ansItem["ansMail"] = status.data[j].email;
							for(k=0;k<$scope.size;k++) {
								if($scope.users[k].email === status.data[j].email) {
									$scope.ansItem["ansFname"] = $scope.users[k].firstName;
									$scope.ansItem["ansLname"] = $scope.users[k].lastName;
								}
							}
							$scope.ansItem["likes"] = status.data[j].likes;
							$scope.ansItem["ansDate"] = status.data[j].postedDate;
							$scope.ansItem["ansComments"] = status.data[j].comments;
							cntlr.ansTemp.push($scope.ansItem);
						}
					}
					$scope.item["ans"] = cntlr.ansTemp;
					cntlr.ansData.push($scope.item);
				}
				console.log("COMPLETE FORUM DATA-->",cntlr.ansData);
			}
		});
	};

	cntlr.like = function(ans) {
		var temp = {
			answer: ans
		};
		$http.post('/like',temp).then(function(status) {
			console.log(status);
		});
	};

	cntlr.dislike = function(ans) {
		var temp = {
			answer: ans
		};
		$http.post('/dislike',temp).then(function(status) {
			console.log(status);
		});
	};

	cntlr.delete = function(ans,email) {
		var temp = {
			answer: ans,
			mail: email
		};console.log(temp.mail);
		if(localStorage.email === temp.mail || localStorage.email === "admin@admin.com") {
			if(confirm("Are you sure ?")) {
				$http.post('/delete',temp).then(function(status) {
					if(status.data === "success") {
						console.log("Post deleted");
					} else {
						console.log("Post deletion unsuccessful");
					}
				});
			} else {
				return;
			}
		} else {
			alert("You do not have the permission to delete")
		}
	};


	$scope.reloadRoute = function() {
	   $window.location.reload();
	};

}]);


  var todaysDate = function() {
	var m_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth(); //January is 0!
	var yyyy = today.getFullYear();
	if(dd<10) {
		dd='0'+dd
	};
	today = m_names[mm]+' '+dd+', '+yyyy;
	return today;
};


app.config(function($routeProvider){
		$routeProvider
		.when('/', {
			templateUrl: 'html/home.html',
			controller: 'userController'
		})

		.when('/signup', {
			templateUrl: 'html/signup.html',
			controller: 'userController'
		})

		.when('/login', {
			templateUrl: 'html/login.html',
			controller: 'userController'
		})

		.when('/forum', {
			templateUrl: 'html/forum.html'
		})

		.when('/answer', {
			templateUrl: 'html/forum-answer.html'
		})

		.when('/admin', {
			templateUrl: 'html/admin.html',
			controller: 'adminController'
		})
	});
