app.controller('panelController', ['$http','$scope','$location','dataService', function($http,$scope,$location,dataService){
  panel = this;

  panel.q = 5;

  this.editForm = '';

  this.nav = 1;

  this.tab = 0;

  this.commentsTab = 0;

  this.ansForm = '';

  this.comment = '';

  this.cancel = function() {
    this.comment = '';
    this.ansForm = '';
    this.tab = 0;
    this.commentsTab = 0;
  };

  this.setNav = function(s) {
    this.nav = s;
  };

  this.isNav = function(c) {
    return this.nav === c;
  };

  this.setTab = function(s){
    this.tab = s;
    this.commentsTab = 0;
  };

  this.setCommentsTab = function(s,answer){
    this.commentsTab = s;
    this.tab = 0;
    this.comment = '';
  };


  this.isSelected = function(c){
    return this.tab === c;
  };

  this.commentsSelected = function(c){
    return this.commentsTab === c;
  };

  this.answer = function(qid) {
    if(this.ansForm === '') {
      bootbox.alert("Blank post !!!");
    } else {
      this.ansDetails = {
        answer: this.ansForm,
        quesId: qid,
        email: localStorage.email,
        postedDate: todaysDate(),
        likes: 0,
        likedUsers: [],
        comments: []
      };
      $http.post('/answer',this.ansDetails).then(function(status){
        if(status.data === "success") {
          bootbox.alert('Post was successfull');
        } else {
          bootbox.alert('Sorry !!! Answer could not be posted');
        }
      });
    }
    this.cancel();
  };


this.getComments = function(ans) {
  var temp = {
    answer: ans
  };
  $http.post('/getcomments',temp).then(function(status){
    if(status.data === "error") {
      console.log("Error retrieving the comments");
    } else {
      console.log(status.data);
    }
  });
};


this.addComment = function(ans,main) {
  var temp = {
    name: localStorage.userName+' '+localStorage.lastName,
    date: todaysDate(),
    comment: this.comment,
    answer: ans
  };
  if(this.comment === ''){
    alert('Blank comment !!!');
  } else {
    $http.post('/addcomment',temp).then(function(status){
        if(status.data === 'error') {
          alert('Sorry !!! Comment could not be added');
        } else {
          bootbox.alert("Comment added");
          dataService.commentObj = status.data[0].comments;
          main.displayComments(ans,dataService.commentObj);
        }

  });
  this.comment = '';
  this.cancel();
  }
};


  this.setDetails = function(currentValue) {
    panel.editForm = currentValue;
    this.tab = 1;
    this.commentsTab = 0;
  };

  this.editAnswer = function(currentValue,newValue,ansMail,main) {
    var temp = {
      old: currentValue,
      new: newValue,
      mail: ansMail
    };
    if(localStorage.email === temp.mail || localStorage.email === "admin@admin.com") {
      $http.post('/editAnswer',temp).then(function(status){
        bootbox.alert('Edit was successfull');
        main.EditedAnswer(currentValue,newValue);
      });
      this.tab = 0;
    } else {
			bootbox.alert("You do not have the permission to edit this post")
		}
  };

}]);

app.service('dataService', function() {
  // public API
    this.commentObj= null;
    this.answerObj = null;
});

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
