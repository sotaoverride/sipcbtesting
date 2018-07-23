'use strict'

describe 'Directive: matchInput', ->

  # load the directive's module
  beforeEach module 'r1kApp'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<match-input></match-input>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the matchInput directive'
