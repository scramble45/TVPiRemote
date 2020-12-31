const _ = require("lodash")

class AuthenticationError extends Error {
  constructor(errors) {
    if (!_.isArray(errors)) errors = [errors]
    super(`Authentication error: ${errors.join(", ")}`)
    this.name = "AuthenticationError"
    this.errors = errors
  }
}

class ValidationError extends Error {
  constructor(errors) {
    if (!_.isArray(errors)) errors = [errors]
    super(`Validation error: ${errors.join(", ")}`)
    this.name = "ValidationError"
    this.errors = errors
  }
}

class NotFoundError extends Error {
  constructor(errors) {
    if (!_.isArray(errors)) errors = [errors]
    super(`Not-Found error: ${errors.join(", ")}`)
    this.name = "NotFoundError"
    this.errors = errors
  }
}

module.exports = {
  AuthenticationError,
  ValidationError,
  NotFoundError
}
