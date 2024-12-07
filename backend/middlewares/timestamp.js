// Middleware to update the updatedAt field before saving the document
module.exports.updateTimestamp = function (next) {
  // Setting the field updatedAt to current timestamp
  this.updatedAt = Date.now()
  next()
}

// Middleware to update the updatedAt field before a findOneAndUpdate operation
module.exports.updateTimestampForUpdate = function (next) {
  // Setting the field updatedAt to current timestamp in the update object, because the real document isn't updated until save() is performed
  this._update.updatedAt = Date.now()
  next()
}