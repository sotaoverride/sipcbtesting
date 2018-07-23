'use strict'

angular.module 'r1kApp'
.controller 'DiagCtrl', ($scope, Device) ->
	$scope.forms = diag.forms
	$scope.diag = []
	$scope.submitForm = (cmd) ->
		data = {}
		data[cmd] = $scope.diag[cmd] || ""
		Device.request('requestStatus', data).then (x) ->
			$scope.buildToast('Command has been sent.')
		, () ->
			$scope.buildToast('Uh oh! Couldn\'t send command. Is the device available?')