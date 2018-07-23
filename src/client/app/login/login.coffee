'use strict'

angular.module 'r1kApp'
.config ($stateProvider) ->
	$stateProvider
	.state 'login',
		url: '/login'
		views:
			"root":
				templateUrl: 'app/login/login.html'
				controller: 'LoginCtrl'