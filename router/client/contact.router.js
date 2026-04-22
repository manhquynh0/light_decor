const contactController = require("../../controller/client/contact.controller")
const router = require("express").Router()
router.get("/",contactController.contact)
module.exports = router