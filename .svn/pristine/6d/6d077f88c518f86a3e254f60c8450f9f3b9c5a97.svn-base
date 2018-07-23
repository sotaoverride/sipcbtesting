# 'use strict'

angular.module 'r1kApp', [
  'ngSanitize',
  'ui.router',
  'angularFileUpload',
  'ui.sortable',
  'ngAnimate',
  'ngMaterial',
  'ngIdle',
  'ngMessages',
  'mm.foundation',
  'ct.ui.router.extras'
]
.config ($urlRouterProvider, $locationProvider, $idleProvider, $keepaliveProvider, $mdThemingProvider) ->
  $urlRouterProvider
  .otherwise '/'

  $locationProvider.html5Mode true
  $idleProvider.idleDuration(15*60)
  $idleProvider.warningDuration(30)
  $keepaliveProvider.interval(30)

  # revoPrimary = $mdThemingProvider.extendPalette 'cyan',
  #   '400': '88D4E6'
  #   '500': '0099cc'
  #   '600': '0099cc'
  revoPrimary = $mdThemingProvider.extendPalette 'deep-purple',
    '400': '4b1e78'
    '500': '4b1e78'
    # '500': '0099cc'
    # '600': '0099cc'
  $mdThemingProvider.definePalette 'revoPrimary', revoPrimary

  revoAccent = $mdThemingProvider.extendPalette 'green',
    'A200': '259b24'
  $mdThemingProvider.definePalette 'revoAccent', revoAccent
  $mdThemingProvider.theme 'default'
    .primaryPalette 'revoPrimary',
      'hue-1': '400'
      # 'hue-2': '700'
      # 'hue-3': '497f86'
    .accentPalette 'revoAccent'