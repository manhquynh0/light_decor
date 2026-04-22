const homeController = require("../../controller/client/home.controller")
const router = require("express").Router()
router.get("/home", homeController.home)
module.exports = router
