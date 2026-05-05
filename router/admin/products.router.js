const productsController = require("../../controller/admin/products.controller")
const router = require("express").Router()
const multer = require("multer")
const cloudinary = require("../../helpers/cloudinary.hepler")
const upload = multer({ storage: cloudinary.storage })
router.get("/", productsController.index)
router.get("/add", productsController.openAddModal)
router.post("/add", upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }]), productsController.add)

module.exports = router