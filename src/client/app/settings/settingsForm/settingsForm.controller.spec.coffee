'use strict'

describe 'Controller: SettingsformCtrl', ->

  # load the controller's module
  beforeEach module 'r1kApp'
  SettingsformCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    SettingsformCtrl = $controller 'SettingsformCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
