const aboutController = require("../../controller/client/about.controller")
const router = require("express").Router()
router.get("/",aboutController.about)
module.exports = router