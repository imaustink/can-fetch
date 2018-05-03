import Base from '../lib/base'

test('request() fetches an item', () => {
  class TestFetch extends Base {
    static behaviors = [
      (req, res) => Promise.resolve('{"foo":true}'),
      (req, res) => JSON.parse(res)
    ]
    static pipeline = []
    static resources = {
      get: {
        method: 'GET',
        path: 'resource'
      }
    }
  }

  return TestFetch.request({
    id: 0,
    type: 'get'
  }).then(res => {
    expect(res).toEqual({foo: true})
  })
})
