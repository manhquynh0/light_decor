const newsController = require("../../controller/client/news.controller")
const authMiddleware = require("../../middlewares/auth.middlware")
const router = require("express").Router()
router.get("/", authMiddleware.verifyTokenOptional, newsController.news)
module.exports = router
