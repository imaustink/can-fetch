'use strict'

import { Object as ObserveObject } from 'can-observe'
import param from 'can-param'

function createRejection (message) {
  return Promise.reject(new Error(message))
}

// Here's where the magic happens
export default class CanFetch extends ObserveObject {
  // Send GET request
  static find (query) {
    return this.request({
      type: 'find',
      query
    })
  }

  // Send GET request with ID param
  static get (id) {
    if (id === undefined) {
      return createRejection('ID is required!')
    }
    return this.request({
      type: 'get',
      id
    })
  }

  // Send POST request
  static create (body) {
    if (body === undefined) {
      return createRejection('Body is required!')
    }
    return this.request({
      type: 'create',
      body
    })
  }

  // Send PUT request
  static update (id, body) {
    if (id === undefined || body === undefined) {
      return createRejection('ID and body is required!')
    }
    return this.request({
      type: 'update',
      body,
      id
    })
  }

  static patch (id, body) {
    if (id === undefined || body === undefined) {
      return createRejection('ID and body is required!')
    }
    return this.request({
      type: 'patch',
      body,
      id
    })
  }

  // Send DELETE request
  static remove (id) {
    if (id === undefined) {
      return createRejection('ID is required!')
    }
    return this.request({
      type: 'remove',
      id
    })
  }

  // Request handler, executes behaviors in serries
  static async request ({ id, body, query, headers, type }) {
    let resource = (this.resources && this.resources[type].resource) || this.resource
    let method = (this.resources && this.resources[type].method) || this.methods[type]

    let url = this._uri(resource, id, query)
    let request = { url, body, id, method, headers }
    let response

    for (let i = 0; i < this.behaviors.length; i++) {
      response = await this.behaviors[i].call(this, request, response)
    }

    return response
  }

  // Build URI
  static _uri (path, id, query) {
    let url = id !== undefined ? `${this.base}/${path}/${id}` : `${this.base}/${path}`
    url = query ? `${url}?${param(query)}` : url

    return url
  }

  // Pipeline handler, executes pipeline in order
  static _executePipeline (request, item) {
    let result = item
    for (let i = 0; i < this.pipeline.length; i++) {
      // If no value is returned, assume no mutation was made since last iteration
      result = this.pipeline[i].call(this, request, result) || result
    }
    return result
  }

  // Default base URL
  static base = window.location.origin

  // Default list property
  static listProp = 'data'

  // Defualt id property
  static idProp = 'id'

  // Behaviors define the request and response
  static behaviors = []

  // Pipeline is executed on each datum returned from the API
  static pipeline = []

  static methods = {
    find: 'GET',
    get: 'GET',
    create: 'POST',
    update: 'PUT',
    patch: 'PATCH',
    remove: 'DELETE'
  }
}
