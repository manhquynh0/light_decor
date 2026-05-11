
const crypto = require("crypto")

module.exports.generateOTP = function generateOTP() {
  return crypto.randomInt(100000, 1000000)
}
module.exports.generateRandomNumber = function generateRandomNumber(length) {
  return Math.floor(Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1)) + Math.pow(10, length - 1))
}