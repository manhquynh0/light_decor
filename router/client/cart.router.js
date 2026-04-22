const cartController = require("../../controller/client/cart.controller")
const router = require("express").Router()
router.get("/",cartController.cart)
router.get("/payment",cartController.payment)
module.exports = router