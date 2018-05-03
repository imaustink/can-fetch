export default function stub (object, property, stub) {
  let original
  let copy = object
  let path = property.split('.')
  for (let i = 0; i < path.length; i++) {
    if (i === path.length - 1) {
      original = copy[path[i]]
      copy[path[i]] = stub
    }
    copy = copy[path[i]]
  }
  return function teardown () {
    let copy = object
    for (let i = 0; i < path.length; i++) {
      if (i === path.length - 1) {
        copy[path[i]] = original
        break
      }
      copy = copy[path[i]]
    }
  }
}
