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
      answer: ans,
      email: localStorage.email
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
        if(status.data === "error") {
          bootbox.alert("Sorry...Answer could not be edited");
        } else {
          bootbox.alert('Edit was successfull');
          main.EditedAnswer(currentValue,newValue);
        }
      });
      this.tab = 0;
    } else {
      bootbox.alert("You do not have the permission to edit this post")
    }
  };



  this.deleteComment = function(ans,comms,main) {
    var temp = {
      answer: ans,
      comment: comms.comment
    };
    if(localStorage.email === comms.email || localStorage.email === "admin@admin.com") {
      $http.post('/deletecomment',temp).then(function(status){
        if(status.data === "error") {
          bootbox.alert("Sorry...Comment could not be deleted");
        } else {
          bootbox.alert("Comment deleted successfully");
          dataService.commentObj = status.data[0].comments;
          main.displayComments(ans,dataService.commentObj);
        }
      });
    } else {
      bootbox.alert("You do not have the permission to delete this comment");
    }
  };


  this.deleteQuestion = function(question,mail,main) {
    var temp = {
      question: question,
      quesEmail: mail
    };
    if(localStorage.email === temp.quesEmail || localStorage.email === "admin@admin.com") {
      bootbox.confirm("Are you sure you want to delete this question ?", function(result){
        if(result) {
          $http.post('/deletequestion',temp).then(function(status) {
            if(status.data === "error") {
              bootbox.alert("Question deletion unsuccessful");
            } else {
              bootbox.alert("Question deleted successfully");
              main.forumDetails = [];
              main.ansData = [];
              main.quesDetails();
            }
          });
        } else {
          return;
        }
      });
    } else {
      bootbox.alert("You do not have permission to delete this question");
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
