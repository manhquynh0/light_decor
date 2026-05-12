const cartController = require("../../controller/client/cart.controller")
const router = require("express").Router()
router.get("/", cartController.cart)
router.get("/payment", cartController.payment)
router.post("/payment", cartController.paymentPost)
router.post("/detail", cartController.detailCart)
router.post("/apply-coupon", cartController.applyCoupon)
router.post("/order", cartController.orderPost)
module.exports = router