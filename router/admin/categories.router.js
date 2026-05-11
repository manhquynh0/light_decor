const categoriesController = require("../../controller/admin/categories.controller")
const router = require("express").Router()

router.get("/", categoriesController.index)
router.get("/add", categoriesController.openAddModal)
router.post("/add", categoriesController.add)
router.get("/edit/:id", categoriesController.openEditModal)

router.patch("/delete/:id", categoriesController.delete)
module.exports = router