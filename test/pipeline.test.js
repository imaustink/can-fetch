import Base from '../lib/base'
import store from '../lib/store'
import { cacheData, hydrateData } from '../lib/operations'

test('cacheData()', () => {
  const req = {method: 'DELETE', id: 0}
  const item = {
    id: 0
  }

  cacheData.call(Base, {}, item)

  expect(store.get(Base, 0)).toBe(item)

  cacheData.call(Base, req, item)

  expect(store.get(Base, 0)).toBe(undefined)
})

test('hydrateData()', () => {
  const raw = {}
  const instance = new Base()

  expect(hydrateData.call(Base, {}, raw)).toBeInstanceOf(Base)
  expect(hydrateData.call(Base, {}, instance)).toBe(instance)
})
