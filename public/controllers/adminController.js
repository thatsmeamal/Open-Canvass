app.controller('adminController',['$http','$scope','$window','$location', function($http,$scope,$window,$location){

  $scope.users = [];

  $scope.getAllUsers = function() {
    $http.get('/getallusers').then(function(status) {
      $scope.users = status.data;
    });
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
            $scope.getAllUsers();
          }
        });
      }
    });
  };

}]);
