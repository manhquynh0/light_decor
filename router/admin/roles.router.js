const rolesController = require("../../controller/admin/roles.controller")
const router = require("express").Router()

router.get("/", rolesController.index)
router.get("/add", rolesController.openAddModal)
router.post("/add", rolesController.add)
router.get("/edit/:id", rolesController.openEditModal)
router.patch("/edit/:id", rolesController.edit)
router.patch("/delete/:id", rolesController.delete)
module.exports = router