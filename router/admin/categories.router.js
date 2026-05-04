const categoriesController = require("../../controller/admin/categories.controller")
const router = require("express").Router()
const multer = require("multer")
const cloudinary = require("../../helpers/cloudinary.hepler")
const upload = multer({storage : cloudinary.storage})
router.get("/", categoriesController.index)
router.get("/add", categoriesController.openAddModal)
router.post("/add", upload.single("avatar"), categoriesController.add)
module.exports = router