const productsController = require("../../controller/admin/products.controller")
const router = require("express").Router()

router.get("/", productsController.index)
router.get("/add", productsController.add)
router.post("/add", productsController.create)
router.get("/:id/edit", productsController.edit)
router.put("/:id", productsController.update)
router.delete("/:id", productsController.delete)

module.exports = router