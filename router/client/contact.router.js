const contactController = require("../../controller/client/contact.controller")
const authMiddleware = require("../../middlewares/auth.middlware")
const router = require("express").Router()
router.get("/", authMiddleware.verifyTokenOptional, contactController.contact)
module.exports = router