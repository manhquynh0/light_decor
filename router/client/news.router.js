const newsController = require("../../controller/client/news.controller")
const router = require("express").Router()
router.get("/", newsController.news)
module.exports = router
