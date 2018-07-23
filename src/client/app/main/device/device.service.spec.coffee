'use strict'

describe 'Service: device', ->

  # load the service's module
  beforeEach module 'r1kApp'

  # instantiate service
  device = undefined
  beforeEach inject (_device_) ->
    device = _device_

  it 'should do something', ->
    expect(!!device).toBe true