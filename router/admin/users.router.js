const usersController = require("../../controller/admin/users.controller")
const router = require("express").Router()

router.get("/", usersController.index)
router.get("/add", usersController.add)
router.post("/add", usersController.create)
router.get("/:id/edit", usersController.edit)
router.put("/:id", usersController.update)
router.delete("/:id", usersController.delete)

module.exports = router