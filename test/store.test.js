import Base from '../lib/base'
import store, { cacheMap } from '../lib/store'

beforeEach(() => {
  store.empty(Base)
})

test('store._getCache()', () => {
  const cache = store._getCache(Base)

  expect(cache).toEqual({})
})

test('store.set() and store.get()', () => {
  const id = 0
  const item = {}

  store.set(Base, id, item)

  expect(store.get(Base, id)).toBe(item)
})

test('store.get() undefined ID', () => {
  expect(store.get(Base, 0)).toBe(undefined)
})

test('store.empty()', () => {
  store.set(Base, {})
  store.empty(Base)

  expect(cacheMap.get(Base)).toBe(undefined)
})
