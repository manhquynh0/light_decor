const categoriesController = require("../../controller/admin/categories.controller")
const router = require("express").Router()

router.get("/", categoriesController.index)

module.exports = router