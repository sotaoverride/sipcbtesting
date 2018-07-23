'use strict'

angular.module 'r1kApp'
.directive 'matchTo', ->
	restrict: 'A'
	require: 'ngModel'
	link: (scope, element, attrs, ngModel) ->
		ngModel.$validators.match = (modelValue) ->
			angular.isUndefined(modelValue) or modelValue is scope.$eval(attrs.matchTo)
		scope.$watch attrs.matchTo, (n) ->
			if n then ngModel.$validate()
.directive 'form', ->
	restrict: 'E'
	link: (scope, element, attrs) ->
		scope.$watch 'configForm.$submitted', (n) ->
			if n and Object.keys(scope.configForm.$error).length > 0
				scope.configForm.$setPristine()
				scope.buildToast((if scope.configForm.$error.required then 'Error! All required values must be provided.' else 'Error! Please correct invalid values.'), 1)
				angular.forEach scope.configForm.$error, (e, key) -> #array of errors
					angular.forEach e, (f) -> #e = array of formControllers
						angular.forEach f.$error, (x) -> #array of nested formControllers
							x[0].$setTouched() #No need to loop through forms as the nested forms have one control each
.directive 'inputDisabled', ->
	restrict: 'A'
	require: 'ngModel'
	link: (scope, element, attrs, ngModel) ->
		scope.$watch attrs.inputDisabled, (n,o) ->
			if n
				element.attr 'disabled', 'true'
			else
				element.removeAttr 'disabled'
.directive 'checkStep', ->
	restrict: 'A'
	require: 'ngModel'
	link: (scope, element, attrs, ngModel) ->
		ngModel.$validators.check = (modelValue) ->
			if attrs.checkStep > 0
				modelValue % attrs.checkStep is 0
			else
				true
.directive 'hasValue', ->
	restrict: 'A'
	require: 'ngModel'
	link: (scope, element, attrs, ngModel) ->
		ngModel.$formatters.push (v) ->
			val = v.length > 0
			element.css('display', if val then 'block' else 'none')
			val
.directive 'formatArray', ->
	restrict: 'A'
	require: 'ngModel'
	link: (scope, element, attrs, ngModel) ->
		ngModel.$parsers.push (v) ->
			char = attrs['formatArray'] || ' '
			val = ngModel.$modelValue.split(char)
			ind = ~~attrs.index
			val[ind] = v
			val.join(char)
		ngModel.$formatters.push (v) ->
			char = attrs['formatArray'] || ' '
			val = v.split(char)
			ind = ~~attrs.index
			if attrs.output == 'num' then ~~val[attrs.index] else val[attrs.index]
.directive 'hashPass', ->
	restrict: 'A'
	require: 'ngModel'
	link: (scope, element, attrs, ngModel) ->
		ngModel.$validators.pattern = (m,v) ->
			if attrs.hashPass and attrs.pattern and v
				test = attrs.ngPattern.test v
				if !test
					scope.configForm.$setPristine()
				test
			else
				true
		ngModel.$formatters.push (v) ->
			if attrs.hashPass then '' else v
		ngModel.$parsers.push (v) ->
			if !v
				ngModel.$setPristine()
			if attrs.hashPass and v then scope.hash(v) else (v || '')
	controller: ($scope, Auth) ->
		$scope.hash = (v) ->
			Auth.hashPass v
.directive 'add', ->
	restrict: 'A'
	controller: ($scope) ->
		$scope.prop = []
		$scope.total = 0
		$scope.addProp = (propName, val) ->
			if $scope.prop[propName] == undefined
				$scope.prop[propName] = []
			$scope.prop[propName].unshift val
			$scope.total = 0
			angular.forEach $scope.prop[propName], (value, key) ->
				$scope.total += ~~value
.directive 'addTotal', ->
	restrict: 'A'
	require: ['ngModel', '^add']
	link: (scope, element, attrs, req) ->
		ngModel = req[0]
		scope.addProp attrs.name, attrs.addTotal
		ngModel.$formatters.push (v) ->
			bt = v&~~attrs.addTotal
			if bt isnt 0 then 1 else 0
		ngModel.$parsers.push (v) ->
			val = ~~ngModel.$modelValue
			x = 0
			if val > scope.total
				angular.forEach scope.prop[attrs.name], (t, k) ->
					a = val&~~t
					x=x+a
				val = x
			if v == 1 then val + ~~attrs.addTotal else val - ~~attrs.addTotal
.directive 'showMenu', ->
	restrict: 'A'
	controller: ($state, $scope, $rootScope) ->
		$rootScope.$on '$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) ->
			$scope.inactive = ''
			if $state.includes('dialog')
				$scope.inactive = $state.href fromState.name, fromParams
			else if toState.name isnt fromState.name
				$scope.showSubMenu = toState.name
		$scope.inactive = ''
		$scope.showSubMenu = $state.current.name
		$scope.selectMenu = (m) ->
			$scope.showSubMenu = m || $state.current.name
			$scope.$applyAsync()
.directive 'showSubMenu', ->
	restrict: 'A'
	require: '^^showMenu'
	link: (scope, element, attrs) ->
		element.on 'mouseenter', () ->
			scope.selectMenu attrs.uiSref
		element.on 'mouseleave', () ->
			if !element.hasClass 'activeView'
				scope.selectMenu ''
		scope.$watchGroup ['showSubMenu', 'inactive'], (n) ->
			if attrs.uiSref is n[0] and !element.hasClass 'activeView'
				element.addClass 'showMenu'
			else
				element.removeClass 'showMenu'
.directive 'subMenu', ($state) ->
	restrict: 'A'
	require: '^^showMenu'
	link: (scope, element, attrs) ->
		hideMenu = (n) ->
			if attrs.subMenu isnt n
				element.addClass 'ng-hide'
			else
				element.removeClass 'ng-hide'
		scope.$watch 'showSubMenu', (n,o) ->
			hideMenu(n)
		element.on 'mouseenter', () ->
			scope.selectMenu attrs.subMenu
		element.on 'mouseleave', () ->
			if attrs.subMenu isnt $state.current.name
				scope.selectMenu ''
.directive 'subMenuParam', ->
	restrict: 'A'
	require: '^^showMenu'
	link: (scope, element, attrs) ->
		scope.$watch 'inactive', (n) ->
			if attrs.href is n and !element.hasClass 'activeView'
				element.addClass 'showMenu'
			else
				element.removeClass 'showMenu'