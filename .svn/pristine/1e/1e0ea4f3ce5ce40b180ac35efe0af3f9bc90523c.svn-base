'use strict'

angular.module 'r1kApp'
.config ($stateProvider) ->
	$stateProvider
	.state 'main',
		url: '/'
		abstract: true
		sticky: true
		deepStateRedirect: true
		views:
			"root":
				templateUrl: 'app/main/main.html'
				controller: 'MainCtrl'
		resolve:
			loadSettings: (Device) ->
				Device.request('requestProperties').then (res) ->
					Device.request('requestStatus').then (statsRes) ->
						currCfg = angular.extend({}, res, statsRes)
						ro = Object.keys(currCfg)
						return () ->
							cfg = {}
							settingsSections = []
							# Loop through defined form elements to format the data as needed.
							angular.forEach formData, (v, i) ->
								cfgVal = if currCfg[v.name] is undefined then '' else currCfg[v.name]
								index = ro.indexOf(v.name)
								if index != -1
									ro.splice(index, 1)
								# Populate array of current settings sections
								if v.section and settingsSections.indexOf(v.section) < 0
									settingsSections.push(v.section)
								if v.type is 'number' or v.type is 'range' or v.type is 'checkbox' or v.type is 'select' or v.type is 'addCheckbox' or v.type is 'tmp'
									# Ensure numeric values are properly typed for validation purposes
									cfgVal = if cfgVal.length > 0 and `cfgVal == Number(cfgVal)` then Number(cfgVal) else cfgVal
									if v.type is 'checkbox' and cfgVal.length > 3
										cfgVal = if cfgVal is "true" then 1 else 0
								else if v.type is 'sortable'
									cfgVal = []
									sortArray = []
									angular.forEach v.lists, (el, num) ->
										sortArray.push([])
									options = []
									num = 1
									ct = Object.keys(v.values).length
									while options.length < ct
										if v.values[num] isnt undefined
											origVal = currCfg[v.name + num]
											currSetting = ~~origVal
											currLabel = ''
											newVal = 0
											if origVal is undefined or origVal is "0"
												angular.forEach v.values, (v2, n2) ->
													if options.indexOf(~~n2) is -1
														if currSetting is 0
															currLabel = v2
															currSetting = ~~n2
											else
												newVal = currSetting
												currLabel = v.values[currSetting]
											if origVal >=0
												cfg[v.name + num] = newVal
												ro.splice(ro.indexOf(v.name+num), 1)
											options.push(currSetting)
											newOption = {value: currSetting, label: currLabel, setting: v.name}
											sv = if newVal != 0 then 0 else 1
											sortArray[sv].push(newOption)
										num++
									angular.forEach v.lists, (el, num) ->
										cfgVal[num] =
											name: el.name
											props: sortArray[num]
											req: el.req
								cfg[v.name] = cfgVal
							angular.forEach ro, (rov, rok) ->
								cfg[rov] = currCfg[rov]
							configVals =
								settingsSections: settingsSections
								currentSettings: cfg
.run ($rootScope, $state, Auth, $mdDialog, $idle, $window, Device) ->
	$rootScope.$on '$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
		if toParams.toolID is '' or toParams.sectionId is ''
			event.preventDefault()
		isUser = Auth.user()
		if isUser and (toState.name is 'login' or toState.name is 'dialog')
			event.preventDefault()
			if !fromState.name.length
				$state.go 'main.home'
		else if !isUser and toState.name isnt 'login'
			event.preventDefault()
			$state.go 'login'
	$rootScope.$on '$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) ->
		if toState.url isnt fromState.url and fromState.name.length>1 and toState.name.search(/main/) is 0 and fromState.name.search(/dialog/) is -1
			$state.reload()
	$rootScope.$on '$stateNotFound', () ->
		$state.go 'main.home'
	$rootScope.$on '$keepalive', () ->
		if $state.current.name isnt 'main.home'
			Auth.updateSession()
	$rootScope.$on '$idleStart', () ->
		$window.scroll(0,0)
		$mdDialog.show
			clickOutsideToClose: false,
			escapeToClose: false,
			template: '<md-dialog aria-label="timeoutDialog"><md-content class="timeoutDialog">
			<h2>Warning!</h2>
			<p>Your session will timeout soon unless user activity is detected.</p>
			<div class="progressCounter"><span>:</span>{{durTime}}</div>
			<md-progress-circular class="md-warn" mode="determinate" value="{{dur}}" md-diameter="100"></md-progress-circular>
			</md-content></md-dialog>'
			controller: 'timeoutController'
	$rootScope.$on '$idleTimeout', () ->
		$rootScope.timedOut = true
		$mdDialog.hide()
	$rootScope.$on '$idleEnd', () ->
		Auth.updateSession()
		$mdDialog.hide()
.controller 'timeoutController', ($scope) ->
	$scope.dur = 100
	$scope.durTime = "30"
	$scope.$on '$idleWarn', (e, countdown) ->
		$scope.dur = ((countdown/30)*100).toFixed()
		$scope.durTime = if countdown<10 then '0'+countdown else countdown