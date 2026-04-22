const categoriesController = require("../../controller/admin/categories.controller")
const router = require("express").Router()

router.get("/", categoriesController.index)
router.get("/add", categoriesController.add)
router.post("/add", categoriesController.create)
router.get("/:id/edit", categoriesController.edit)
router.put("/:id", categoriesController.update)
router.delete("/:id", categoriesController.delete)

module.exports = router