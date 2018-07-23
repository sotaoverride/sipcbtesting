'use strict'

angular.module 'r1kApp'
.controller 'SettingsformCtrl', ($scope, $stateParams, $state, $window, $interval, Device, $sce) ->
	$scope.currentSection = $stateParams.sectionId
	$scope.vfields = [0]
	$scope.dst = dstValues
	$scope.dstHours = dstHours
#	$scope.showSubmitButton = $scope.currentSection isnt 'camera'
	$scope.showSubmitButton = true
	$scope.disableSubmit = true
	$scope.statusProps = []
	override = $scope.currentSection is 'network'
	callbacks = []
	startVals = {}
	
	$scope.cs = [{
			name: ''
			
		}]
	if angular.isUndefined $scope.currentSection
		$state.go 'main.home', {},
			reload: true
			inherit: false
			notify: true
	# Update stats on a 5 second interval
	if $scope.currentSection is 'camera'
		intUpdate = $interval () ->
			Device.request('requestStatus').then (stats) ->
				angular.forEach stats, (value, key) ->
					$scope.currentSettings[key] = value || ''
		,2000
	angular.forEach $scope.formData, (v, i) ->
		if v.section is $scope.currentSection
			if v.field is undefined
				$scope.formData[i].field = 0
			else if $scope.vfields.indexOf(v.field) < 0
				if v.show isnt undefined
					if $scope.currentSettings[v.show] then $scope.vfields.push(v.field)
				else $scope.vfields.push(v.field)
			if v.type is 'multiNumber' and v.dataType is 'int'
				angular.forEach v.values, (value, key) ->
					$scope.statusProps.push value.name
			if v.type is 'sortable'
				angular.forEach v.values, (value, key) ->
					sVal = v.name+key
					if $scope.currentSettings[sVal] isnt undefined
						startVals[sVal] = $scope.resetCurrentVal sVal
						callbacks[sVal] = v.cb
			else
				startVals[v.name] = $scope.resetCurrentVal v.name
				$scope.currentSettings[v.name] = if v.hash then '' else $scope.currentSettings[v.name] || startVals[v.name]
			if v.cb
				callbacks[v.name] = v.cb
	$scope.$watchCollection 'currentSettings', (n) ->
		$scope.newSettings = []
		angular.forEach startVals, (value, key) ->
			if !($scope.currentSettings[key] == value)
				$scope.configForm.$setDirty()
				$scope.newSettings.push key
	$scope.submitProps = () ->
		if $scope.configForm.$valid
			if override
				$scope.newSettings = Object.keys startVals
			$scope.updateSettings($scope.newSettings, override, callbacks, $scope.configForm)
	$scope.sortableErr =
		na: false
	$scope.dndSort =
		containment: '.sortable'
		containerPositioning: 'relative'
		accept: (src) ->
			item = src.itemScope
			if (item.$last and item.$first and angular.element(item.sortableScope.element).hasClass('required'))
				$scope.sortableErr.na = true
				false
			else
				true
		dragEnd: (src) ->
			sortName = src.source.itemScope.modelValue.setting
			count = 0
			angular.forEach $scope.currentSettings[sortName], (value, n) ->
				angular.forEach value.props, (val, num) ->
					prop = sortName + ++count
					if $scope.currentSettings[prop] isnt undefined
						$scope.currentSettings[prop] = if n is 1 then 0 else val.value
			if !$scope.sortableErr.na and $scope.configForm.$pristine
				$scope.configForm.$setDirty()
			$scope.sortableErr.na = false
	$scope.uploadDialog = ($event, tool, name) ->
		$event.preventDefault()
		$window.scroll(0,0)
		startState = $state.current.name
		go = $state.go 'dialog.tool', {toolID: tool},
			location: false
			inherit: false
		go.then () ->
			if $scope.currentSettings[name].length < 1
				check = $interval () ->
					if $state.current.name is startState
						$interval.cancel(check)
						Device.request('requestProperties').then (res) ->
							$scope.currentSettings[name] = res[name]
				,5000

	$scope.$on '$destroy', () ->
		$interval.cancel intUpdate			