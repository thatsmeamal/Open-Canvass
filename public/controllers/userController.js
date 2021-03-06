var app = angular.module('canvass', ['ngRoute', 'ngCookies', 'ui.bootstrap']);

app.controller('userController',['$http','$scope','$window','$location','dataService',
'$rootScope', '$cookieStore', function($http,$scope,$window,$location,dataService,
  $rootScope,$cookieStore) {

    $http({
      method: 'POST',
      url: 'https://fcm.googleapis.com/fcm/send',

      headers: {
        'Authorization': 'key=AIzaSyBawUaDqxEiPsOEFC9s3kBM_DJVHKnMNeI',
        'Content-Type': 'application/json',
      },
      data: {
        "collapse_key": "score_update",
        "time_to_live": 108,
        "notification": {
          "title": "CANVASS REQUIRED !!!",
          "body": "User-1 is in urgent need of this device.",
          "icon": "http://www.jithumpa.com/wp-content/uploads/2014/01/logo.png",
          "click_action" : "https://www.google.com",
        },
        "to" : $.cookie("token")
      }
  })

  var cntlr = this;
  $scope.currentUser = localStorage.userName;
  cntlr.nav = 0;

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


  $scope.readActive = function() {
    cntlr.nav = 1;
  };

  $scope.answerActive = function() {
    cntlr.nav = 2;
  };

  $scope.yourContentActive = function() {console.log("!!!!!!");
    cntlr.nav = 3;
  };

  $scope.yourBookmarksActive = function() {
    cntlr.nav = 4;
  };

  $scope.isNav = function(s) {
    return cntlr.nav === s;
  };

  $scope.clearInfo = function() {
    $rootScope.globals = {
      email: null
    };
    $cookieStore.put('globals',$rootScope.globals);
    var a = $cookieStore.get('globals');
  };

  $scope.checkInfo = function(s) {
    var a = $cookieStore.get('globals');
    if(a.email === localStorage.email) {
      if(s === 1) {
        $location.path('/forum').replace();
      }
      if(s === 2) {
        $location.path('/answer').replace();
      }
      if(s === 3) {
        $location.path('/yourcontent').replace();
      }
      if(s === 4) {
        $location.path('/bookmarks').replace();
      }
    } else {
      bootbox.alert("You are not logged In");
      $location.path('/').replace();
    }
  };

  $scope.newUser = function(){
    var pwd= $scope.regUser.pwd;
    var confirmpwd = $scope.regUser.confirmpwd;
    if(pwd === confirmpwd){
      $http.post('/register', $scope.regUser).then(function(status){
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
        } else {
          localStorage.userName = $scope.regUser.fname;
          localStorage.lastName = $scope.regUser.lname;
          localStorage.email = $scope.regUser.email;
          $rootScope.globals = {
            email: $scope.regUser.email
          };
          $cookieStore.put('globals', $rootScope.globals);
          $location.path('/forum').replace();
        }
      });
    } else {
      bootbox.alert('Passwords do not match !!')
    }

  };


  $scope.logUser = function() {
    var email = $scope.logs.email;
    var pwd = $scope.logs.pwd;
    if(email === "admin@admin.com" && pwd === "admin"){
      localStorage.userName = "admin";
      localStorage.email = email;
      $rootScope.globals = {
        email: "admin@admin.com"
      };
      $cookieStore.put('globals', $rootScope.globals);
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
          $rootScope.globals = {
            email: status.data.email
          };
          $cookieStore.put('globals', $rootScope.globals);
          $location.path('/forum').replace();
        }
      });
    }
  };

  $scope.postQuestion = function() {
    if($scope.searchBar.question.length === 0) {
      bootbox.alert("Blank Post !!!");
    } else {
      $scope.searchBar.userId = localStorage.userId;
      $scope.searchBar.email = localStorage.email;
      $scope.searchBar.postedDate = todaysDate();
      $scope.searchBar.firstName = localStorage.userName;
      $scope.searchBar.lastName = localStorage.lastName;
      $scope.searchBar.bookmarks = [];
      $http.post('/ask',$scope.searchBar).then(function(status){
        if(status.data === "error") {
          bootbox.alert("Sorry, something went wrong.\nQuestion could not be posted")
        } else {
          console.log("............",status.data);
          bootbox.alert('Your question will be posted shortly');
          $scope.item = {};
          $scope.item["questionId"] = status.data[0].questionId;
          $scope.item["question"] = status.data[0].question;
          $scope.item["quesFname"] = status.data[0].firstName;
          $scope.item["quesLname"] = status.data[0].lastName;
          $scope.item["quesDate"] = status.data[0].postedDate;
          $scope.item["quesEmail"] = status.data[0].email;
          cntlr.ansData.unshift($scope.item);
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


  cntlr.quesDetails = function() {
    var j = '';
    cntlr.forumDetails = [];
    cntlr.ansData = [];
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
          $scope.dets["firstName"] = status.data[j].firstName;
          $scope.dets["lastName"] = status.data[j].lastName;
          $scope.dets["bookmarks"] = status.data[j].bookmarks;
          $scope.dets["bookmarked"] = false;
          cntlr.forumDetails.push($scope.dets);
          $scope.mail = {};
          $scope.mail["email"] = status.data[j].email;
          $scope.id.push($scope.mail);
        };
        $scope.user();
        console.log("Question Details-->",cntlr.forumDetails);
        cntlr.ansInfo();
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
          $scope.item["quesEmail"] = cntlr.forumDetails[i].email;
          $scope.item["quesBookmarks"] = cntlr.forumDetails[i].bookmarks;
          $scope.item["quesBookmarked"] = false;
          cntlr.ansTemp = [];					//IMPORTANT
          for(j=0;j<status.data.length;j++) {
            if(cntlr.forumDetails[i].questionId === status.data[j].quesId) {
              $scope.ansItem = {};
              $scope.ansItem["answer"] = status.data[j].answer;
              $scope.ansItem["ansMail"] = status.data[j].email;
              for(k=0;k<$scope.users.length;k++) {
                if($scope.users[k].email === status.data[j].email) {
                  $scope.ansItem["ansFname"] = $scope.users[k].firstName;
                  $scope.ansItem["ansLname"] = $scope.users[k].lastName;
                }
              }
              $scope.ansItem["likes"] = status.data[j].likes;
              $scope.ansItem["likedUsers"] = status.data[j].likedUsers;
              $scope.ansItem["liked"] = false;
              $scope.ansItem["ansDate"] = status.data[j].postedDate;
              $scope.ansItem["ansComments"] = status.data[j].comments;
              cntlr.ansTemp.push($scope.ansItem);
            }
          }
          $scope.item["ans"] = cntlr.ansTemp;
          cntlr.ansData.push($scope.item);
        }
        console.log("COMPLETE FORUM DATA-->",cntlr.ansData);
        cntlr.userLikes();
        cntlr.isBookmarked();
      }
    });
  };

  cntlr.like = function(ans) {
    var temp = {
      answer: ans,
      email: localStorage.email
    };
    var i = 0;
    var j = 0;
    $http.post('/isliked',temp).then(function(details) {
      if(details.data === "false") {
        this.liked = true;
        $http.post('/like',temp).then(function(status) {
          for(i=0;i<cntlr.ansData.length;i++) {
            for(j=0;j<cntlr.ansData[i].ans.length;j++){
              if(temp.answer === cntlr.ansData[i].ans[j].answer) {
                cntlr.ansData[i].ans[j].likes = status.data[0].likes;
                cntlr.ansData[i].ans[j].liked = true;
              }
            }
          }
        });
      } else {
        console.log("You already liked this post");
      }
    });
  };

  cntlr.dislike = function(ans) {
    var temp = {
      answer: ans,
      email: localStorage.email
    };
    var i = 0,
    j = 0;
    $http.post('/isliked',temp).then(function(details) {
      if(details.data === "true") {
        this.liked = false;
        $http.post('/dislike',temp).then(function(status) {
          for(i=0;i<cntlr.ansData.length;i++) {
            for(j=0;j<cntlr.ansData[i].ans.length;j++){
              if(temp.answer === cntlr.ansData[i].ans[j].answer) {
                cntlr.ansData[i].ans[j].likes = status.data[0].likes;
                cntlr.ansData[i].ans[j].liked = false;
              }
            }
          }
        });
      } else {
        console.log("You do not like this post");
      }
    });
  };

  this.displayComments = function(answer,data) {
    for(i=0;i<cntlr.ansData.length;i++) {
      for(j=0;j<cntlr.ansData[i].ans.length;j++){
        if(answer === cntlr.ansData[i].ans[j].answer) {
          cntlr.ansData[i].ans[j].ansComments = data;
        }
      }
    }
  };

  this.EditedAnswer = function(oldAns,newAns) {
    for(i=0;i<cntlr.ansData.length;i++) {
      for(j=0;j<cntlr.ansData[i].ans.length;j++){
        if(oldAns === cntlr.ansData[i].ans[j].answer) {
          cntlr.ansData[i].ans[j].answer = newAns;
        }
      }
    }
  };

  cntlr.delete = function(ans,email,ques) {
    var temp = {
      answer: ans,
      mail: email,
      question: ques
    };
    if(localStorage.email === temp.mail || localStorage.email === "admin@admin.com") {
      bootbox.confirm("This action cannot be reverted...Are you sure ?", function(result){
        if(result) {
          $http.post('/deletepost',temp).then(function(status) {
            if(status.data === "error") {
              console.log("Post deletion unsuccessful");
            } else {
              var quesId = status.data[0]._id;
              console.log(quesId);
              for(i=0;i<cntlr.ansData.length;i++) {
                if(quesId === cntlr.ansData[i].questionId) {
                  for(j=0;j<cntlr.ansData[i].ans.length;j++) {
                    if(ans === cntlr.ansData[i].ans[j].answer) {
                      cntlr.ansData[i].ans.splice(j,1);
                    }
                  }
                }
              }
            }
          });
        } else {
          return;
        }
      });
    } else {
      bootbox.alert("You do not have the permission to delete this post !!!");
    }
  };

  cntlr.userLikes = function() {
    var temp = {
      email: localStorage.email
    };
    for(i=0;i<cntlr.ansData.length;i++) {
      for(j=0;j<cntlr.ansData[i].ans.length;j++) {
        for(k=0;k<cntlr.ansData[i].ans[j].likedUsers.length;k++) {
          if(cntlr.ansData[i].ans[j].likedUsers[k] === localStorage.email) {
            cntlr.ansData[i].ans[j].liked = true;
            cntlr.ansData[i].ans[j].likes = cntlr.ansData[i].ans[j].likes;
          }
        }
      }
    }
  };

  cntlr.yourContent = function() {
    var j = '';
    cntlr.forumDetails = [];
    cntlr.ansData = [];
    $http.get('/quesdata').then(function(status){
      if(status.data === "error") {
        console.log("YOUR DATA CANNOT BE LOADED")
      } else {
        console.log("YOUR DATA LOADED");
        for(j=0;j<status.data.length;j++) {
          if (status.data[j].email === localStorage.email) {
            $scope.dets = {};
            $scope.dets["questionId"] = status.data[j]._id
            $scope.dets["question"] =  status.data[j].question;
            $scope.dets["userId"] = status.data[j].userId;
            $scope.dets["email"] = status.data[j].email;
            $scope.dets["postedDate"] = status.data[j].postedDate;
            $scope.dets["firstName"] = status.data[j].firstName;
            $scope.dets["lastName"] = status.data[j].lastName;
            $scope.dets["bookmarks"] = status.data[j].bookmarks;
            cntlr.forumDetails.push($scope.dets);
            $scope.mail = {};
            $scope.mail["email"] = status.data[j].email;
            $scope.id.push($scope.mail);
          }
        };
        $scope.user();
        console.log("Your Question Details-->",cntlr.forumDetails);
        cntlr.ansInfo();
      }
    });
  };

  cntlr.setBookmark = function(question) {
    var temp = {
      question: question,
      email: localStorage.email
    };
    $http.post('/setbookmark',temp).then(function(status) {
      if(status.data === "error") {
        bootbox.alert("Sorry...Bookmark could not be set");
      } else {
        bootbox.alert("Bookmark set successfully");
        for(i=0;i<cntlr.ansData.length;i++) {
          if(cntlr.ansData[i].question === temp.question) {
            cntlr.ansData[i].bookmarked = true;
            cntlr.ansData[i].quesBookmarks = [];
            cntlr.ansData[i].quesBookmarks = status.data[0].bookmarks;
            console.log(cntlr.ansData[i].quesBookmarks);
          }
        }
      }
    });
  };

  cntlr.removeBookmark = function(question) {
    var temp = {
      question: question,
      email: localStorage.email
    };
    $http.post('/removebookmark',temp).then(function(status) {
      if(status.data === "error") {
        bootbox.alert("Sorry...Bookmark could not be removed");
      } else {
        bootbox.alert("Bookmark removed successfully");
        for(i=0;i<cntlr.ansData.length;i++) {
          if(cntlr.ansData[i].question === temp.question) {
            cntlr.ansData[i].bookmarked = false;
            cntlr.ansData[i].quesBookmarks = [];
            cntlr.ansData[i].quesBookmarks = status.data[0].bookmarks;
            console.log(cntlr.ansData[i].quesBookmarks);
          }
        }
      }
    });
  };

  cntlr.isBookmarked = function() {
    for(i=0;i<cntlr.ansData.length;i++) {
      for(j=0;j<cntlr.ansData[i].quesBookmarks.length;j++) {
        if(cntlr.ansData[i].quesBookmarks[j] === localStorage.email) {
          cntlr.ansData[i].bookmarked = true;
        }
      }
    }
  };

  cntlr.getBookmarks = function() {
    var j = 0;
    var k = 0;
    cntlr.forumDetails = [];
    cntlr.ansData = [];
    $http.get('/quesdata').then(function(status){
      if(status.data === "error") {
        console.log("BOOKMARKS CANNOT BE LOADED")
      } else {
        console.log("BOOKMARKS LOADED");
        console.log(status.data);
        for(j=0;j<status.data.length;j++) {
          var flag = 0;
          for(k=0;k<status.data[j].bookmarks.length;k++) {
            if(status.data[j].bookmarks[k] === localStorage.email) {
              flag = 1;
            }
          }
          if (flag === 1) {
            $scope.dets = {};
            $scope.dets["questionId"] = status.data[j]._id
            $scope.dets["question"] =  status.data[j].question;
            $scope.dets["userId"] = status.data[j].userId;
            $scope.dets["email"] = status.data[j].email;
            $scope.dets["postedDate"] = status.data[j].postedDate;
            $scope.dets["firstName"] = status.data[j].firstName;
            $scope.dets["lastName"] = status.data[j].lastName;
            $scope.dets["bookmarks"] = status.data[j].bookmarks;
            cntlr.forumDetails.push($scope.dets);
            $scope.mail = {};
            $scope.mail["email"] = status.data[j].email;
            $scope.id.push($scope.mail);
          }
        };
        $scope.user();
        console.log("Your Question Details-->",cntlr.forumDetails);
        cntlr.ansInfo();
      }
    });
  };


}]);

var currentEmail = function() {
  return localStorage.email;
};


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
