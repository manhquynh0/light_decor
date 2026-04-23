const homeController = require("../../controller/client/home.controller")
const authMiddleware = require("../../middlewares/auth.middlware")
const router = require("express").Router()
router.get("/home", authMiddleware.verifyTokenOptional, homeController.home)
module.exports = router
