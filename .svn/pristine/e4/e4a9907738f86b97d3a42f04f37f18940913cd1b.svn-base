'use strict'

angular.module 'r1kApp'
.factory 'Auth', ($window, $state, $idle, $rootScope, $keepalive, Device) ->
	Auth = {}
	Auth.sessionID = {}
	clearSession = () ->
		$window.localStorage.clear()
		Auth.sessionID = {}
		Device.sessionId ''
		$idle.unwatch()
		$keepalive.stop()
		$state.go 'login'
	storeSession = (exp, id, ka) ->
		Auth.sessionID =
			id: id || Auth.sessionID.id
			keepAlive: if ka isnt undefined then ka else Auth.sessionID.keepAlive
			exp: if exp then Date.now()+(~~exp*1000) else Auth.sessionID.exp
		$window.localStorage.clear()
		$window.localStorage['revoUC1k_session'] = JSON.stringify Auth.sessionID
		Device.sessionId Auth.sessionID.id
		$rootScope.sessionExp = 0
	validateSession = () ->
		isUser = 0
		local = $window.localStorage['revoUC1k_session']
		if Auth.sessionID.id or local
			Auth.sessionID = if !Auth.sessionID.id then JSON.parse local else Auth.sessionID
			now = Date.now()
			if !Auth.sessionID.exp or ((Auth.sessionID.exp - now)/1000/-60) > 15
				$rootScope.timedOut = true
			else
				isUser = 1
				storeSession()
		isUser
	$rootScope.$watch 'sessionExp', (x) ->
		if x then storeSession x
	$rootScope.$watch 'timedOut', (x) ->
		if x then Auth.logout()
	Auth.hashPass = (pass) ->
		if pass
			md = forge.md.md5.create()
			md.update pass
			md.digest().toHex()
	Auth.login = (exp, id, ka) ->
		storeSession(exp, id, ~~ka)
	Auth.user = () ->
		Auth.sessionID.keepAlive || validateSession()
	Auth.watch = () ->
		if Auth.sessionID.keepAlive
			$keepalive.start()
		else
			$idle.watch()
	Auth.updateSession = () ->
		Device.request('requestProperties', {keepAlive: ''}).then (success) ->
			if success["sessionId"] is Auth.sessionID.id then storeSession 900
	Auth.logout = () ->
		if $state.current.name isnt 'login'
			Device.request('requestProperties', {logout: ''}).then (success) ->
				if success["sessionId"] is Auth.sessionID.id then Auth.logout()
		clearSession()
	Auth