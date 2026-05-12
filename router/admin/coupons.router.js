const router = require("express").Router()
const couponsController = require("../../controller/admin/coupons.controller")

router.get("/", couponsController.index)
router.get("/add", couponsController.openAddModal)
router.post("/add", couponsController.add)
router.get("/edit/:id", couponsController.openEditModal)
router.patch("/edit/:id", couponsController.edit)
router.patch("/toggle/:id", couponsController.toggle)
router.patch("/delete/:id", couponsController.delete)

module.exports = router
