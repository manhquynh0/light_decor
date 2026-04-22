const settingController = require("../../controller/client/setting.controller")
const router = require("express").Router()
router.get("/",settingController.setting)

module.exports = router