const productsController = require("../../controller/client/products.controller")
const authMiddleware = require("../../middlewares/auth.middlware")
const multer = require("multer")
const cloudinary = require("../../helpers/cloudinary.hepler")
const upload = multer({ storage: cloudinary.storage })
const router = require("express").Router()
router.get("/", authMiddleware.verifyTokenOptional, productsController.products)
router.get("/:slug", authMiddleware.verifyTokenOptional, productsController.productDetail)
router.post("/:slug/review", upload.fields([
    { name: 'images', maxCount: 5 }
]), authMiddleware.verifyToken, productsController.review)
module.exports = router