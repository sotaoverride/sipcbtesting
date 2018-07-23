'use strict'

describe 'Controller: DiagCtrl', ->

  # load the controller's module
  beforeEach module 'r1kApp'
  DiagCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    DiagCtrl = $controller 'DiagCtrl',
      $scope: scope

  it 'should ...', ->
