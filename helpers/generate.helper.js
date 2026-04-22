
const crypto = require("crypto")

module.exports.generateOTP = function generateOTP() {
  return crypto.randomInt(100000, 1000000)
}