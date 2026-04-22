const productsController = require("../../controller/client/products.controller")
const router = require("express").Router()
router.get("/", productsController.products)
router.get("/product-detail", productsController.productDetail)
module.exports = router