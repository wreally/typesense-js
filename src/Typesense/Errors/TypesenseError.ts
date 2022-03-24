export default class TypesenseError extends Error {
  httpStatus?: number

  // Source: https://stackoverflow.com/a/58417721/123545
  constructor (message?: string) {
    super(message)
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
