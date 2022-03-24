import TypesenseError from './TypesenseError'
import type { ImportResponseFail } from '../Documents'

export default class ImportError extends TypesenseError {
  importResults: ImportResponseFail
  constructor (message, importResults) {
    super(message)
    this.importResults = importResults
  }
}
