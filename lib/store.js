export const cacheMap = new WeakMap()

// A class to manage caching
const store = {
  // Create and update
  set (mapKey, id, item) {
    const cache = this._getCache(mapKey)
    const cachedItem = cache[id]

    if (cachedItem) {
      Object.assign(cachedItem, item)
    } else {
      cache[id] = item
    }

    return cache[id]
  },

  // Get by ID
  get (mapKey, id) {
    return this._getCache(mapKey)[id]
  },

  // Remove by id
  remove (mapKey, id) {
    delete this._getCache(mapKey)[id]
  },

  // Empty entire cache
  empty (mapKey) {
    cacheMap.delete(mapKey)
  },

  _getCache (mapKey) {
    let cache = cacheMap.get(mapKey)
    if (cache !== undefined) {
      return cache
    } else {
      cache = {}
      cacheMap.set(mapKey, cache)
      return cache
    }
  }
}

export default store
