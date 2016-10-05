app.controller('adminController',['$http','$scope','$window','$location', '$cookieStore',
 function($http,$scope,$window,$location,$cookieStore){

  $scope.users = [];

  $scope.getAllUsers = function() {
    var a = $cookieStore.get('globals');
    console.log("!!!!!!!",a.email);
		if(a.email === 'admin@admin.com') {
			//$location.path('/admin').replace();
      $http.get('/getallusers').then(function(status) {
        $scope.users = status.data;
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
            $scope.getAllUsers();
          }
        });
      }
    });
  };

}]);
