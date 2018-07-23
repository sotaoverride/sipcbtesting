'use strict'

angular.module 'r1kApp'
.controller 'ToolsCtrl', ($scope, $stateParams, Device, $state, $mdDialog, $sce) ->
	toolID = tools[$stateParams.toolID or $state.current.url]
	if angular.isUndefined(toolID)
		$state.go 'main.home', {},
			reload: true
			inherit: false
			notify: true
	else
		$scope.dialog = $state.includes 'dialog'
		$scope.forms = toolID.forms
		$scope.newSettings = []
		$scope.cb = []
		angular.forEach $scope.forms, (value, key) ->
			angular.forEach value.input, (v, k) ->
				if v.type isnt 'file' and v.type isnt 'form' and $scope.newSettings.indexOf(k) is -1
					if v.type is 'array'
						x = {}
						angular.forEach v.values, (val, name) ->
							x[name] = 0
						$scope.resets = x
					$scope.newSettings.push(k)
					if v.type isnt 'checkbox'
						$scope.currentSettings[k] = ''
	$scope.resetDefaults = (b) ->
		a = $scope.resets
		if !a['all']
			x = []
			angular.forEach a, (v, k) ->
				if v
					x.push k
			$scope.currentSettings[b] = x.join(':')
			$scope.cb = []
		else
			$scope.currentSettings[b] = 'all'
			$scope.cb["sys.reset-setting"] = "reset"
	initFileInfo =
		noSubmit: true
		bundle: formData
		errMsg: ''
		state: ''
	$scope.fileInfo = initFileInfo
	$scope.test = 'No'
	$scope.$watch 'fileInfo.bundle', (v) ->
		if v.name isnt undefined
			$scope.test = 'Yes'
	$scope.dropFile = (files, accept) ->
		$scope.fileInfo = angular.copy initFileInfo
		$scope.fileInfo.bundle = files[0]
		# Check for single file only, includes folders
		if files.length is 1
			# Check for file extensions - only needed for update files
			toAccept = false
			if angular.isArray accept
				angular.forEach accept, (v,i) ->
					if !toAccept
						toAccept = v.test files[0].name
			else
				toAccept = accept.test files[0].name
			if !toAccept
				$scope.fileInfo.errMsg = 'This file does not appear to be the correct extension.'
				$scope.fileInfo.state = 'error'
			else
				$scope.fileInfo.noSubmit = false
				$scope.fileInfo.state = 'valid'
		else
			$scope.fileInfo.errMsg = 'Sorry, but only a single file can be uploaded.'
			$scope.fileInfo.state = 'error'
	$scope.submitForm = (reqType) ->
		$sce.trustAsResourceUrl Device.baseUrl(reqType)
	$scope.updateFirmware2 = (reqType) ->
		$scope.configChk = true
		mydig = $mdDialog.show {
  			locals: {
  				type: reqType
  				file: $scope.fileInfo.bundle
  				dialog: $scope.dialog
  				configChk: $scope.configChk
  				globalUpdateFirmware: globalUpdateFirmware
  			},
			clickOutsideToClose: false,
			escapeToClose: false,
			template: '<md-dialog aria-label="resetDialog"><md-content>
				<h2>Warning!</h2>
				<p class="warnMsg">Performing this action may require rebooting the device. Would you like to continue?</p>
				</md-content>
				<div class="md-actions">
					<md-button class="md-raised" ng-click="close()">No</md-button>
					<md-button class="md-raised md-primary" ng-click="confirm()">Yes</md-button>
				</div>
				</md-dialog>'
			controller: 'warning'
			onComplete: () ->
					angular.element(document).find('body').css('overflow', 'visible')
					angular.element(document).find('md-dialog-container').css('margin', 'auto')
					angular.element(document).find('md-dialog-container').css('width', '50%')
		}
		mydig.then () ->
			angular.element(document).find('body').css('overflow', 'initial')
			 
		#$scope.fileInfo = initFileInfo
	$scope.updateFirmware = (reqType) ->
		$mdDialog.show {
  			locals: {
  				type: reqType
  				file: $scope.fileInfo.bundle
  				dialog: $scope.dialog
  			},
			clickOutsideToClose: false,
			escapeToClose: false,
			template: '<md-dialog aria-label="Alert" class="toolDialog"><md-content><div>
				<h6 class="progressMessage">{{upgrader.message}}</h6>
				<div class="dialogContent" ng-show="upgrader.show">
					<span class="progressValue" ng-show="upgrader.total > 0"><strong>{{upgrader.total}}</strong><span>%</span></span>
					<md-progress-circular md-mode="indeterminate" md-diameter="110" class="outerProgress"></md-progress-circular>
				</div>
				<h6 class="versionMessage" ng-show="version.length > 0">v{{version}}</h6>
				</div></md-content>
				<md-button class="md-action md-raised md-primary" ng-if="confirm" ng-click="hideDialog()">OK</md-button></md-dialog>'
			controller: 'notifyCtrl'
		}
		$scope.fileInfo = initFileInfo
	globalUpdateFirmware = (reqType) ->
		$mdDialog.show {
  			locals: {
  				type: reqType
  				file: $scope.fileInfo.bundle
  				dialog: $scope.dialog
  			},
			clickOutsideToClose: false,
			escapeToClose: false,
			template: '<md-dialog aria-label="Alert" class="toolDialog"><md-content><div>
				<h6 class="progressMessage">{{upgrader.message}}</h6>
				<div class="dialogContent" ng-show="upgrader.show">
					<span class="progressValue" ng-show="upgrader.total > 0"><strong>{{upgrader.total}}</strong><span>%</span></span>
					<md-progress-circular md-mode="indeterminate" md-diameter="110" class="outerProgress"></md-progress-circular>
				</div>
				<h6 class="versionMessage" ng-show="version.length > 0">v{{version}}</h6>
				</div></md-content>
				<md-button class="md-action md-raised md-primary" ng-if="confirm" ng-click="hideDialog()">OK</md-button></md-dialog>'
			controller: 'notifyCtrl'
		}
		$scope.fileInfo = initFileInfo


.controller 'notifyCtrl', ($scope, Device, type, file, $mdDialog, $state, $window, $timeout, dialog) ->
	$window.scroll(0,0)
	successMsg = switch (type)
		when 'uploadFirmware' then 'Device has successfully been updated! App will be refreshed now.'
		when 'importContacts' then 'Contacts have been successfully imported!'
		when 'importConfig' then 'Device configuration has been successfully imported! For security, some SIP account settings aren\'t imported and must be provided to register with the SIP server.'
		else 'Upload successfully completed!'
	notifyMsg =
		'begin': 'Uploading file.'
		'upload': if type is 'importConfig' then 'Applying new configuration.' else 'File upload complete.'
		'init': 'Update initializing.'
		'update': 'Device is updating.'
		'WaitingCallEnd': 'Update waiting for active call(s) to end.'
		'Flashing': 'Update in progress.'
		'reboot': 'Update complete! Rebooting device.'
		'success': successMsg
		'error': 'Process could not be completed. Please check the device.'
		'device': 'Update has successfully completed but the device is unavailable. Please check the device IP address.'
	refresh = false
	int = ''
	$scope.confirm = false
	$scope.version = ''
	if type is 'uploadFirmware'
		bName = file.name
		if bName.search(/(FLX)/) > -1 && bName.search(/-/) > -1
			version = bName.substr 0, bName.search /[^A-Za-z0-9-]/
			$scope.version = version.replace /(?:[^-]+-){3}(\d+)-(\d+)-(\d+)-(\d+)-?/g, '$1.$2.$3.$4'
	$scope.hideDialog = () ->
		$mdDialog.hide()
		if refresh
			$state.go('main.home').then () ->
				$window.location.reload true
		else if !dialog
			$state.reload()
	$scope.upgrader =
		message: notifyMsg['begin']
		total: 0
		show: 1
	Device.update(file, type).then (success)->
		$scope.upgrader.total = 100
		m = 'success'
		if type is 'uploadFirmware' 
			$scope.upgrader.message = notifyMsg[m]
			refresh = true
			$timeout $scope.hideDialog, 5000
		else
			complete(m)
			$scope.upgrader.show = 0
	, (err) ->
		$scope.version = ''
		$scope.upgrader.show = 0
		if err 
			console.log('err', err)
		complete(if err then err else 'error')
	, (notify) ->
		$scope.upgrader.message = notifyMsg[notify[1]]
		if type is 'uploadFirmware' 
			if notify[1] is 'upload'
				if notify[0] < 100
					$scope.upgrader.message = notifyMsg['begin']
			else if notify[1] is 'update'
				$scope.upgrader.total = notify[0]
			else
				$scope.upgrader.total = 0
		else
			$scope.upgrader.total = notify[0]
	complete = (t) ->
		$scope.upgrader.message = notifyMsg[t] or t
		$scope.confirm = true
.controller 'warning', ($scope, globalUpdateFirmware, Device,file,configChk,type,$mdDialog) ->
	configChk=true
	$scope.close = () ->
		$mdDialog.hide()
	$scope.confirm = (reqType,file) ->
		globalUpdateFirmware(type,file)
		#$mdDialog.hide()
	#$scope.confirmMsg = confirm