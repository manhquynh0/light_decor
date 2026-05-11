const dashboardController = require("../../controller/admin/dashboard.controller")
const router = require("express").Router()

router.get("/", dashboardController.dashboard)
router.post("/revenue-chart", dashboardController.revenueChart)
module.exports = router