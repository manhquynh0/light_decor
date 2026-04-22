const dashboardController = require("../../controller/admin/dashboard.controller")
const router = require("express").Router()

router.get("/", dashboardController.dashboard)
module.exports = router