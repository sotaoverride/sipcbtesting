'use strict'

describe 'Controller: ToolsCtrl', ->

  # load the controller's module
  beforeEach module 'r1kApp'
  ToolsCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ToolsCtrl = $controller 'ToolsCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
