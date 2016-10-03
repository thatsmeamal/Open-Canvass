app.controller('panelController', ['$http','$scope','$location', function($http,$scope,$location){
  panel = this;

  this.editForm = '';

  this.nav = 1;

  this.tab = 0;

  this.commentsTab = 0;

  this.ansForm = '';

  this.comment = '';

  this.cancel = function() {
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
  };


  this.isSelected = function(c){
    return this.tab === c;
  };

  this.commentsSelected = function(c){
    return this.commentsTab === c;
  };

  this.answer = function(qid) {
    if(this.ansForm === '') {
      alert("Blank post !!!");
    } else {
      this.ansDetails = {
        answer: this.ansForm,
        quesId: qid,
        email: localStorage.email,
        postedDate: todaysDate(),
        likes: 0,
        comments: []
      };
      $http.post('/answer',this.ansDetails).then(function(status){
        if(status.data === "success") {
          alert('Post was successfull');
        } else {
          alert('Sorry !!! Answer could not be posted');
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


this.addComment = function(ans) {
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
          alert('Comment added successfully');
        }
  });
  this.cancel();
  }
};


  this.setDetails = function(currentValue) {
    panel.editForm = currentValue;
    this.tab = 1;
    this.commentsTab = 0;
  };

  this.editAnswer = function(currentValue,newValue,ansMail) {
    var temp = {
      old: currentValue,
      new: newValue,
      mail: ansMail
    };
    if(localStorage.email === temp.mail || localStorage.email === "admin@admin.com") {
      $http.post('/editAnswer',temp).then(function(status){
        alert('Edit was successfull');
      });
      this.tab = 0;
    } else {
			alert("You do not have the permission to edit this post")
		}
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
