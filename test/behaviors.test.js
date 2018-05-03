import Base from '../lib/base'
import stub from '../test-utils/stub'
import { fetchData, parseResponse, executePipeline } from '../lib/behaviors'

const teardown = stub(window, 'Headers', function (headers) {
  return headers
})

afterAll(() => {
  teardown()
})

test('fetch()', () => {
  const url = 'api.foo.com'
  const method = 'GET'
  const body = {
    foo: true
  }
  const headers = {
    foo: 'bar'
  }
  const teardown = stub(window, 'fetch', (passedUrl, options) => {
    expect(passedUrl).toBe(url)
    expect(options).toEqual({
      body: JSON.stringify(body),
      headers: Object.assign({
        'Content-Type': 'application/json'
      }, headers),
      method
    })
    teardown()
  })

  fetchData({
    url,
    body,
    headers,
    method
  })
})

test('parseResponse() 200 OK', () => {
  const response = {
    foo: true
  }

  return parseResponse(null, {
    status: 200,
    json () {
      return Promise.resolve(response)
    }
  })
    .then(data => {
      expect(data).toEqual(response)
    })
})

test('parseResponse() 400 Bad Request', () => {
  const response = {
    code: 99,
    message: 'BEPKAC'
  }
  const statusText = 'Bad Request'

  return parseResponse(null, {
    status: 400,
    statusText,
    json () {
      return Promise.resolve(response)
    }
  })
    .catch(data => {
      expect(data.response).toEqual(response)
      expect(data).toBeInstanceOf(Error)
      expect(data.message).toBe(statusText)
    })
})

test('pipline list', () => {
  const request = {}
  const response = {
    data: [
      {}
    ]
  }

  class TestFetch extends Base {
    static _executePipeline (passedRequest, passedItem) {
      expect(passedRequest).toBe(request)
      expect(passedItem).toBe(response.data[0])
      return passedItem
    }
  }

  const returnedResponse = executePipeline.call(TestFetch, request, response)
  expect(returnedResponse).toEqual(response)
})

test('pipline item', () => {
  const request = {}
  const response = {}

  class TestFetch extends Base {
    static _executePipeline (passedRequest, passedItem) {
      expect(passedRequest).toBe(request)
      expect(passedItem).toBe(response)
      return passedItem
    }
  }

  const returnedResponse = executePipeline.call(TestFetch, request, response)
  expect(returnedResponse).toEqual(response)
})
