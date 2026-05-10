const productsController = require("../../controller/client/products.controller")
const authMiddleware = require("../../middlewares/auth.middlware")
const router = require("express").Router()
router.get("/", authMiddleware.verifyTokenOptional, productsController.products)
router.get("/:slug", authMiddleware.verifyTokenOptional, productsController.productDetail)
module.exports = router