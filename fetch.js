import Base from './lib/base'
import { fetchData, parseResponse, executePipeline } from './lib/behaviors'
import { cacheData, hydrateData } from '../lib/operations'

export default class Fetch extends Base {
  // Behaviors define the request and response
  static behaviors = [
    fetchData,
    parseResponse,
    executePipeline
  ]

  // Pipeline is executed on each datum returned from the API
  static pipeline = [
    cacheData,
    hydrateData
  ]
}
