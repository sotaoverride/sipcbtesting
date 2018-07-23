'use strict'

angular.module 'r1kApp'
.controller 'HomeCtrl', ($scope, $interval, Device) ->
	$scope.squares =
		'system':
			title: ''
		'media':
			title: ''
		# 	show: $scope.isVoip

	$scope.componentStatus = [{
			prop: "call.status.usb"
			label: "USB Call Status"
			cat: 'media'
		}, {
			prop: "audio.usb-audio-stream"
			label: "USB Audio Stream"
			cat: 'media'
			type: 'bin'
		}, {
			prop: "cam.camera-status"
			label: "Camera"
			cat: 'media'
			type: 'upgrade'
			val: 'sys.camera-upgrade-status'
		}, {
			prop: "cam.camera-stream"
			label: "Stream"
			cat: 'media'
			type: 'bin'
		}, {
			prop: "cam.camera-door"
			label: "Privacy Door"
			cat: 'media'
			type: 'bin'
		}, {
			prop: "net.ip"
			label: "IP Address"
			cat: 'system'
		},{
			prop: "sys.base-ver"
			label: "Software Version"
			cat: 'system'
		},{
			prop: "sys.base-sernum"
			label: "Serial Number"
			cat: 'system'
		},{
			prop: "net.mac"
			label: "MAC Address"
			cat: 'system'
		},{
			prop: "sys.restart"
			label: "Restart Device"
			cat: 'system'
			type: 'btn'
		}]

	$scope.btData = [{
			prop: "bt.bt-name"
			label: "Bluetooth Name"
		}, {
			prop: "bt.bt-mac"
			label: "Bluetooth MAC Address"
		}, {
			prop: "call.status.bt"
			label: "Call Status"
			show: 'bt.bt-connected'
		}, {
			prop: "bt.bt-paired-list"
			label: "Paired Devices"
			type: 'btnlist'
			btns: [{
			# 	cmd: 'bt.bt-unpair'
			# 	label: 'Unpair'
			# 	mac: true
			# }, {
				cmd: 'bt.bt-disconnect'
				label: 'Disconnect'
				conn: true
			}]
			props: ['Name', 'MAC Address']
			headProp: "bt.bt-pair"
			headShowProp: 'bt.bt-status'
			headBtns: [{
				name: 'Pair'
				val: 1
				hideVal: 'off'
			},{
				name: 'Cancel Pairing'
				val: 0
				showVal: 'pairing'
			},{
				name: "Unpair All Devices"
				prop: "bt.bt-unpair"
				val: 'all' #or mac
			}]
		}]

	$scope.bleData = [{

			
		
	}]	
	blefilter = (str) ->
		if str is 'ble-standby' then return 'Disabled'
		if str is 'ble-advertising' then return 'Disconnected'
		if str is 'ble-connected' then return 'Connected'
		else return 'unkown'

	$scope.pairButton = (click) ->
		$scope.pairLabel = if $scope.isPairing then 'Cancel Pairing' else 'Pair'
		if click then $scope.deviceCmd('bt.bt-pair', ~~!$scope.isPairing)

	fmtBt = () ->
		$scope.btStatus = $scope.currentSettings['bt.bt-status'].toLowerCase()
		$scope.btPct = ~~$scope.currentSettings['sys.bt-upgrade-status']
		$scope.btUpgrade = $scope.btPct > 0
		$scope.isBt = $scope.btStatus != 'off'
		$scope.btPaired = $scope.currentSettings['bt.bt-paired-list'].length > 0
		$scope.btConnected = $scope.currentSettings['bt.bt-connected'] != 0
		$scope.isPairing = ~~($scope.btStatus == 'pairing')
		$scope.pairButton()
		if $scope.isBt and $scope.btPaired and $scope.btConnected
			conList = $scope.currentSettings['bt.bt-connected'].split ' '
			list = $scope.currentSettings['bt.bt-paired-list'].split ','
			$scope.btPhones = []
			angular.forEach list, (value, key) ->
				if value.length
					y = value.indexOf(' ')
					ph = [value.substr(0, y).trim(), value.substr(y).trim()]
					ph.push conList[0] == ph[0]
					$scope.btPhones.push ph
	fmtBle = () ->
		$scope.bleStatus = blefilter($scope.currentSettings['ble.ble-status'])
		#$scope.btPct = ~~$scope.currentSettings['sys.bt-upgrade-status']
		#$scope.btUpgrade = $scope.btPct > 0
		$scope.isBle = $scope.bleStatus != 'off'
		
	fmtBt()
	fmtBle()

	# Update stats on a 5 second interval
	intUpdate = $interval () ->
		Device.request('requestStatus').then (stats) ->
			angular.forEach stats, (value, key) ->
				$scope.currentSettings[key] = value || ''
			fmtBt()
			fmtBle()
	,2000
	$scope.upStr = (str) ->
		cap = str.slice(0,1).toUpperCase()
		cap + str.slice(1)

	$scope.$on '$destroy', () ->
		$interval.cancel intUpdate