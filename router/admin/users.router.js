const usersController = require("../../controller/admin/users.controller")
const router = require("express").Router()
const multer = require("multer")
const cloudinary = require("../../helpers/cloudinary.hepler")
const upload = multer({ storage: cloudinary.storage })
router.get("/", usersController.index)
router.get("/add", usersController.openAddModal)
router.post("/add", upload.single("avatar"), usersController.add)
module.exports = router