const rolesController = require("../../controller/admin/roles.controller")
const router = require("express").Router()

router.get("/", rolesController.index)
router.get("/add", rolesController.add)
router.post("/add", rolesController.create)
router.get("/:id/edit", rolesController.edit)
router.put("/:id", rolesController.update)
router.delete("/:id", rolesController.delete)

module.exports = router