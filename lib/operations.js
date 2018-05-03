import store from './store'

// Pipeline operation to cache each datum
export function cacheData (request, item) {
  const id = item[this.idProp]
  if (request.method === 'DELETE') {
    store.remove(this, request.id)
  } else {
    return store.set(this, id, item)
  }
}

// Pipeline operation to hydrate each datum into a rick type
export function hydrateData (request, item) {
  if (item instanceof this) {
    return item
  } else {
    return new this(item)
  }
}
