
const productsRouter = require("./products.router")
const usersRouter = require("./users.router")
const ordersRouter = require("./orders.router")
const rolesRouter = require("./roles.router")
const categoriesRouter = require("./categories.router")
const dashboardRouter = require("./dashboard.router")
const chatRouter = require("./chat.router")
const couponsRouter = require("./coupons.router")
const router = require("express").Router()
const authMiddleware = require("../../middlewares/auth.middlware")

// Sub-routers
router.use("/dashboard", authMiddleware.verifyToken, dashboardRouter)
router.use("/products", authMiddleware.verifyToken, productsRouter)
router.use("/users", authMiddleware.verifyToken, usersRouter)
router.use("/orders", authMiddleware.verifyToken, ordersRouter)
router.use("/roles", authMiddleware.verifyToken, rolesRouter)
router.use("/categories", authMiddleware.verifyToken, categoriesRouter)
router.use("/chat", authMiddleware.verifyToken, chatRouter)
router.use("/coupons", authMiddleware.verifyToken, couponsRouter)

module.exports = router