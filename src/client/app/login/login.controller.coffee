'use strict'

angular.module 'r1kApp'
.controller 'LoginCtrl', ($scope, Auth, $state, $rootScope, Device, $timeout) ->
	errorKeys =
		noDevice: false
		noAuth: false
		required: false
	core =
		vp: "sys.validate-password"
		sid: "sessionId"
		exp: "sessionDur"
	$scope.auth =
		token: ''
		saveSession: 0
		error:
			timedOut: $rootScope.timedOut
	$timeout () ->
		if $scope.token isnt undefined
			$scope.maskPass $scope.token
		else
			$scope.token = ''
	, 300
	$scope.isLogin = 'loginBackground'
	$scope.productTitle = 'Device Manager'
	$scope.maskPass = (t) ->
		$scope.auth.token = Auth.hashPass t
	$scope.login = () ->
		$rootScope.timedOut = false
		$scope.auth.error = angular.copy(errorKeys)
		if !$scope.auth.token.length
			$scope.auth.error.required = true
		else
			pass = {}
			pass[core.vp] = $scope.auth.token
			Device.request('requestProperties', pass).then (yay) ->
				if ~~yay[core.vp]
					Auth.login(yay[core.exp], yay[core.sid], $scope.auth.saveSession)
					$state.go 'main.home'
				else
					$scope.auth.error.noAuth = true
					$scope.auth.token = ''
			, (errMsg) ->
				$scope.auth.error.noDevice = true