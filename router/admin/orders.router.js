const ordersController = require("../../controller/admin/orders.controller")
const router = require("express").Router()

router.get("/", ordersController.index)
router.get("/:id", ordersController.detail)
router.put("/:id/status", ordersController.updateStatus)
router.delete("/:id", ordersController.delete)

module.exports = router