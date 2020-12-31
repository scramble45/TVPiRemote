module.exports = function wrapHandler(asyncFn) {
  return function asyncHandler(req, res, next) {
    asyncFn(req, res, next).catch(next)
  }
}
