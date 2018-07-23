'use strict'

angular.module 'r1kApp'
.config ($stateProvider) ->
	$stateProvider
	.state 'main.settings',
		url: 'settings/'
		abstract: true
		template: '<ui-view/>'