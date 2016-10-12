app.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'html/login.html',
		controller: 'userController'
	})

	.when('/signup', {
		templateUrl: 'html/signup.html',
		controller: 'userController'
	})

	.when('/forum', {
		templateUrl: 'html/forum.html'
	})

	.when('/answer', {
		templateUrl: 'html/forum-answer.html'
	})

	.when('/yourcontent', {
		templateUrl: 'html/your-content.html'
	})

	.when('/bookmarks', {
		templateUrl: 'html/bookmarks.html'
	})

	.when('/admin', {
		templateUrl: 'html/admin.html',
		controller: 'adminController'
	})
});
