// Behavior to send HTTP requests using fetch
export function fetchData ({ url, body, method, headers }) {
  return window.fetch(url, {
    body: JSON.stringify(body),
    headers: new Headers({
      ...headers,
      'Content-Type': 'application/json'
    }),
    method
  })
}

// Behavior to parse response as JSON
export function parseResponse (request, response) {
  if (response.status < 200 || response.status >= 300) {
    return response.json().then(data => {
      const error = new Error(response.statusText)
      error.response = data

      throw error
    })
  }

  return response.json()
}

// Behavior to process each datum
export function executePipeline (request, response) {
  const list = response[this.listProp]
  if (Array.isArray(list)) {
    response[this.listProp] = list
      .map(item => this._executePipeline(request, item))
    return response
  }

  if (Array.isArray(response)) {
    return response.map(item => this._executePipeline(request, item))
  }

  return this._executePipeline(request, response)
}
