'use strict'

angular.module 'r1kApp'
.config ($stateProvider) ->
	$stateProvider.state 'dialog',
		url: '/dialog'
		abstract: true
		template: '<ui-view/>'
		onEnter: ['$mdDialog', '$previousState', ($mdDialog, $previousState) ->
			$mdDialog.show {
				template: '<md-dialog aria-label="Dialog" class="toolDialog"><md-content><ui-view/></md-content></md-dialog>'
				controller: ['$scope', '$mdDialog', ($scope, $mdDialog) ->
					$scope.closeDialog = () ->
						$mdDialog.hide()
				]
			}
			.finally () ->
				$previousState.go()
		]