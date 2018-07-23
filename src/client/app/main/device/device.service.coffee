'use strict'

angular.module 'r1kApp'
.factory 'Device', ($http, $q, $upload, $interval, $rootScope) ->
	sessionID = ''
	Device = {}
	Device.sessionId = (x) ->
		sessionID = x
	Device.baseUrl = (r) ->
		window.location.protocol+'//'+window.location.hostname+'/cgi-bin/cgiclient.cgi?'+r+if sessionID then '=&sessionId='+sessionID else '='
	Device.request = (reqType, reqData) ->
		def = $q.defer()
		url = Device.baseUrl(reqType)
		data =
			url: url
			method: 'GET'
			params: if reqType is 'requestStatus' then (reqData || availStats ) else (reqData || availSettings)
		$http(data).success (awesomeThings) ->
			parser = new DOMParser()
			doc = parser.parseFromString awesomeThings, "application/xml"
			j = {}
			angular.forEach doc.getElementsByTagName('properties')[0].attributes, (prop) ->
				if prop.name is 'voip.dial-plan' then prop.value = unescape(prop.value)
				j[prop.name] = prop.value
			if ~~j["sessionExpired"]
				$rootScope.timedOut = true
			else
				$rootScope.sessionExp = 900
			def.resolve(j)
		.error (errMsg) ->
			def.reject(errMsg)
		def.promise
	Device.update = (reqData, reqType) ->
		def2 = $q.defer()
		upload = $upload.upload({
			url: Device.baseUrl(reqType)
			method: 'POST'
			file: reqData
		}).progress((evt) ->
			pct = parseInt(100.0 * evt.loaded / evt.total)
			msg = 'upload'
			if pct is 100 and reqType is 'uploadFirmware'
				msg = 'init'
				pct = -1
			def2.notify([pct, msg])
		).success (data) ->
			if reqType is 'uploadFirmware' 
				def2.notify([-1, 'init'])
				countReboot = 0
				rebootInt = 15
				checkUpgrade = $interval () ->
					Device.request('requestStatus').then (awesomeThings) ->
						currStatus = awesomeThings["sys.upgrade-status"]
						currConfigStatus = awesomeThings["sys.config-import-status"]
						if currConfigStatus is 'rebooting'
							def2.notify([-1, 'reboot'])
							cancelCheck(checkUpgrade)
						else if currStatus < 99
							def2.notify([currStatus, 'update'])
						else if currStatus is 'WaitingCallEnd'
							def2.notify([currStatus, 'WaitingCallEnd'])
						else if currStatus is 'Flashing'
							def2.notify([currStatus, 'Flashing'])
						else if currStatus is 'Rebooting' or currStatus >98
							def2.notify([-1, 'reboot'])
							cancelCheck(checkUpgrade)
							checkReboot()
						

						else
							def2.reject()
							cancelCheck(checkUpgrade)
					, () ->
						def2.reject()
						cancelCheck(checkUpgrade)
				,3000,0
				cancelCheck = (int) ->
					$interval.cancel(int)
				rbtPost = (rbtCheck) ->
					countReboot++
					if countReboot is rebootInt
						def2.reject('device')
						cancelCheck(rbtCheck)
					Device.request('requestStatus').then (woohoo) ->
						rbtStatus = woohoo["sys.upgrade-status"]
						if rbtStatus is 'Ready'
							def2.resolve()
							cancelCheck(rbtCheck)
						else if rbtStatus is 'Rebooting'
							def2.notify([-1, 'reboot'])
					, (badThings) ->
						def2.notify([-1, 'reboot'])
				checkReboot = () ->
					rbtCheck = $interval () ->
						rbtPost(rbtCheck)
					,20000,rebootInt
			else
				$rootScope.sessionExp = 900
				def2.resolve(data)
		, () ->
			def2.reject()
		def2.promise
	availSettings =
		# Admin:
		"sys.ui-mask": ""
		"sys.enable-deploy": ""
		"sys.auto-deploy": ""
		"sys.provisioning-interval": ""
		"sys.ftp-srv1": ""
		"sys.ftp-srv2": ""
		# Audio:
		"audio.ring-tone": ""
		"audio.eq": ""
		"audio.high-pass-filter": ""
		"voip.codec1": ""
		"voip.codec2": ""
		"voip.codec3": ""
		"voip.codec4": ""
		"voip.codec5": ""
		"voip.ptime": ""
		# Calls:
		"voip.mwi": ""
		"voip.vm-number": ""
		"voip.auto-answer": ""
		"voip.do-not-disturb": ""
		"voip.duration": ""
		"voip.dial-plan": ""
		"voip.always-forwarding": ""
		"voip.always-forwarding-num": ""
		"voip.busy-forwarding": ""
		"voip.busy-forwarding-num": ""
		"voip.noanswer-forwarding": ""
		"voip.noanswer-forwarding-num": ""
		"voip.noanswer-delay": ""
		# Region:
		"sys.region": ""
		"sys.time-zone": ""
		"sys.twenty-four-hour-time": ""
		"sys.date-format": ""
		"sys.dst-enabled": ""
		"sys.dst-start-rules": ""
		"sys.dst-end-rules": ""
		# Network:
		"net.dhcp": ""
		"net.ip": ""
		"net.subnet": ""
		"net.gateway": ""
		"net.dns1": ""
		"net.dns2": ""
		"net.ntp1": ""
		"net.ntp2": ""
		"net.ntp3": ""
		"net.ntp4": ""
		"net.ntp-enabled": ""
		"net.vlan": ""
		"net.vlan-id": ""
		"net.dot1x-enabled": ""
		"net.dot1x-auth-method": ""
		"net.dot1x-anonymous-identity": ""
		"net.dot1x-identity": ""
		"net.dot1x-password": ""
		"net.dot1x-cert-path": ""
		# SIP:
		"voip.registrar": ""
		"voip.registrar-backup": ""
		"voip.realm": ""
		"voip.proxy": ""
		"voip.reg-use-proxy": ""
		"voip.user": ""
		"voip.password": ""
		"voip.id": ""
		"voip.name": ""
		"voip.reg-timeout": ""
		"voip.rereg-delay": ""
		"voip.use-timer": ""
		"voip.timer-se": ""
		"voip.timer-min-se": ""
		"voip.use-100rel": ""
		"voip.auto-update-nat": ""
		"voip.no-refer-sub": ""
		"voip.allow-strict": ""
		"voip.min-size": ""
		"voip.dtmf-method": ""
		"voip.dtmf-rtp-payload-type": ""
		"voip.media-onhold-method": ""
		# Transport:
		"voip.use-srtp": ""
		"voip.rtp-port": ""
		"voip.udp-tcp-selection": ""
		"voip.local-port": ""
		"voip.ip-addr": ""
		"voip.stun-srv": ""
		"voip.use-ice": ""
		"voip.ice-regular": ""
		"voip.ice-max-hosts": ""
		"voip.ice-no-rtcp": ""
		"voip.use-turn": ""
		"voip.turn-srv": ""
		"voip.turn-user": ""
		"voip.turn-passwd": ""
		"voip.turn-tcp": ""
		"voip.set-qos": ""
		# Tools:
		"sys.verbose-log-enabled": ""
		# Read only:
		"sys.product": ""
		"sys.base-ver": ""
		"net.mac": ""
		"sys.base-sernum": ""
		# CB
		"sys.voip-capable": ""
		"sys.displaylink-capable": ""
		"sys.systemname": ""
		"sys.telnet-password": ""
		"sys.require-https": ""
		"sys.enable-btn-camera": ""
		"sys.enable-btn-audio": ""
		"sys.enable-btn-volume": ""
		"sys.enable-btn-bluetooth": ""
		"sys.enable-led-call": ""
		"sys.enable-led-nfc": ""
		"sys.power-saving-mode": ""
		# "sys.power-saving-components": ""
		"sys.power-saving-time": ""
		"sys.snmp-enable": ""
		"sys.snmp-address": ""
		"sys.snmp-community": ""
		"sys.snmp-device-location": ""
		"sys.snmp-contact-name": ""
		# "sys.aux-usb-port-mode": ""
		"sys.aux-usb-ip": ""
		"sys.aux-usb-subnet": ""
		# "sys.upgrade-mode": ""
		"sys.dialer-connection-mode": ""
		"audio.analog-audio-in-mode": ""
		"audio.analog-audio-in-gain": ""
		# "audio.voice-pick-up-angle-left": ""
		# "audio.voice-pick-up-angle-right": ""
		"cam.camera-ptz-home": ""
		"cam.camera-flicker" : ""
		"cam.cam-ptz-save-as-default" : ""
		"cam.cam-ptz-apply-defaults" : ""
		"cam.cam-image-save-as-default" : ""
		"cam.cam-image-apply-defaults" : ""
		"cam.camera-image-defaults" : ""
		# "cam.camera-backlight-comp": ""
		# "cam.camera-dewarp-map": ""
		# "cam.camera-tilt-angle": ""
		# "cam.camera-mute": ""
		"bt.bt-enable": ""
		"bt.bt-mac": ""
		"bt.bt-name": ""
		"bt.bt-pin": ""
		"bt.bt-pair-timeout": ""
		"bt.bt-connect-timeout": ""
		"bt.bt-autoconnect": ""
		"ble.ble-advertise": ""
		"ble.ble-pair-timeout": ""
		"sys.enable-telnet": ""
		"sys.recent-call-enabled": ""
		"sys.language": ""
		"ble.ble-status": ""
		"ble.ble-paired": ""
		"ble.ble-connected": ""
		"bt.nfc-enable": ""

	availStats =
		"call.status.usb": ""
		"call.status.bt": ""
		"sys.upgrade-status": ""
		"sys.config-import-status": ""
		# CB
		"sys.camera-upgrade-status": ""
		"sys.bt-upgrade-status": ""
		"sys.dialer-battery-state": ""
		# "sys.power-saving-status": ""
		# "sys.diag-self-test-status": ""
		"audio.usb-audio-stream": ""
		# "audio.beamformer-angle": ""
		# "audio.vad-status": ""
		"cam.camera-status": ""
		"cam.camera-stream": ""
		"cam.camera-door": ""
		"bt.bt-status": ""
		"bt.bt-paired": ""
		"bt.bt-paired-list": ""
		"bt.bt-connected": ""
		"ble.ble-status": ""
		"ble.ble-paired": ""
		"ble.ble-connected": ""
		#"cam.camera-flicker" : ""
		"cam.camera-pan": ""
		"cam.camera-tilt": ""
		"cam.camera-zoom": ""
		"cam.camera-backlight": ""
		"cam.camera-brightness": ""
		"cam.camera-contrast": ""
		"cam.camera-saturation": ""
		"cam.camera-sharpness": ""
		"cam.camera-hue": ""
		"cam.camera-gamma": ""
		
		


	Device