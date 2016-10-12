app.controller('adminController',['$http','$scope','$window','$location', '$cookieStore',
function($http,$scope,$window,$location,$cookieStore){

  $scope.users = [];

  $scope.filteredTodos = [];
  $scope.currentPage = 1;
  $scope.numPerPage = 5;
  $scope.navSize = 5;

  $scope.$watch('currentPage + numPerPage', function() {
    var temp = {
      skip: ($scope.currentPage - 1) * 5
    }
    $http.post('/usersbatch', temp).then(function(status) {
      $scope.userList = [];
      $scope.userList = status.data;
    });
  });

  $scope.getAllUsers = function() {
    var a = $cookieStore.get('globals');
    if(a.email === 'admin@admin.com') {
      $location.path('/admin').replace();
      $http.get('/getallusers').then(function(status) {
        if(status.data === "error") {
          console.log("Something went wrong");
        } else {
          $scope.numUsers = status.data.length;
        }
      });
    } else {
      bootbox.alert("Unauthorised Entry !!");
      $location.path('/').replace();
    }
  };

  $scope.deleteUser = function(mail) {
    var temp = {
      email: mail
    };
    bootbox.confirm("This action cannot be reverted...Are you sure ?", function(result) {
      if(result) {
        $http.post('/deleteuser',temp).then(function(status) {
          if(status.data === "error") {
            bootbox.alert('User could not be deleted');
          } else {
            bootbox.alert('User deleted successfully ');
            $scope.currentPage = 1;
            $scope.getAllUsers();
            $http.post('/usersbatch', temp).then(function(status) {
              $scope.userList = [];
              $scope.userList = status.data;
            });
          }
        });
      }
    });
  };

}]);
