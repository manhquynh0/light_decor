const ordersController = require("../../controller/admin/orders.controller")
const router = require("express").Router()

router.get("/", ordersController.index)
router.patch("/delete/:id", ordersController.delete)
router.get("/detail/:id", ordersController.openOrderDetail)

module.exports = router