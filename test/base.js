import Base from '../lib/base'
import spy from '../test-utils/spy'

const mockFetch = spy()

class BaseTest extends Base {
  static behaviors = [
    mockFetch
  ]
  static resources = {
    create: {
      method: 'POST',
      path: 'resource'
    },
    get: {
      method: 'GET',
      path: 'resource'
    },
    find: {
      method: 'GET',
      path: 'resource'
    },
    update: {
      method: 'PUT',
      path: 'resource'
    },
    remove: {
      method: 'DELETE',
      path: 'resource'
    }
  }
}

beforeEach(() => {
  mockFetch.reset()
})

test('base is an instance of BaseTest', () => {
  const base = new BaseTest()

  expect(base).toBeInstanceOf(BaseTest)
})

test('create works', () => {
  const body = {
    foo: 'bar'
  }

  BaseTest.create(body)

  expect(mockFetch.callCount).toBe(1)

  expect(mockFetch.calls[0].calledWith[0])
    .toEqual({
      url: `${BaseTest.base}/resource`,
      method: 'POST',
      headers: undefined,
      body
    })
})

test('get works', () => {
  const id = 0

  BaseTest.get(id)

  expect(mockFetch.callCount).toBe(1)

  expect(mockFetch.calls[0].calledWith[0])
    .toEqual({
      url: `${BaseTest.base}/resource/${id}`,
      method: 'GET',
      headers: undefined,
      body: undefined,
      id
    })
})

test('find works', () => {
  BaseTest.find()

  expect(mockFetch.callCount).toBe(1)

  expect(mockFetch.calls[0].calledWith[0])
    .toEqual({
      url: `${BaseTest.base}/resource`,
      method: 'GET',
      headers: undefined,
      body: undefined
    })
})

test('update works', () => {
  const id = 0
  const body = {
    foo: true
  }

  BaseTest.update(id, body)

  expect(mockFetch.callCount).toBe(1)

  expect(mockFetch.calls[0].calledWith[0])
    .toEqual({
      url: `${BaseTest.base}/resource/${id}`,
      method: 'PUT',
      headers: undefined,
      body,
      id
    })
})

test('remove works', () => {
  const id = 0

  BaseTest.remove(id)

  expect(mockFetch.callCount).toBe(1)

  expect(mockFetch.calls[0].calledWith[0])
    .toEqual({
      url: `${BaseTest.base}/resource/${id}`,
      method: 'DELETE',
      headers: undefined,
      body: undefined,
      id
    })
})

test('url builder works', () => {
  expect(Base._uri('foo')).toBe(`${BaseTest.base}/foo`)
  expect(Base._uri('bar', 0)).toBe(`${BaseTest.base}/bar/0`)
  expect(Base._uri('baz', 1, { search: 'value' })).toBe(`${BaseTest.base}/baz/1?search=value`)
})

test('CanFetch._executePipeline() item', () => {
  const req = {}
  const item = {}
  class TestFetch extends Base {
    static pipeline = [
      function one (passedReq, passesItem) {
        expect(passedReq).toBe(req)
        expect(passesItem).toBe(item)

        return new this(passesItem)
      },
      function two (passedReq, passesItem) {
        expect(passesItem).toBeInstanceOf(this)
      }
    ]
  }

  TestFetch._executePipeline(req, item)
})
