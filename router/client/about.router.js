const aboutController = require("../../controller/client/about.controller")
const authMiddleware = require("../../middlewares/auth.middlware")
const router = require("express").Router()
router.get("/", authMiddleware.verifyTokenOptional, aboutController.about)
module.exports = router