
const productsRouter = require("./products.router")
const usersRouter = require("./users.router")
const ordersRouter = require("./orders.router")
const rolesRouter = require("./roles.router")
const categoriesRouter = require("./categories.router")
const dashboardRouter = require("./dashboard.router")
const router = require("express").Router()
const authMiddleware = require("../../middlewares/auth.middlware")

// Sub-routers
router.use("/dashboard", authMiddleware.verifyToken, dashboardRouter)
router.use("/products", authMiddleware.verifyToken, productsRouter)
router.use("/users",  authMiddleware.verifyToken,usersRouter)
router.use("/orders", authMiddleware.verifyToken, ordersRouter)
router.use("/roles",  authMiddleware.verifyToken,rolesRouter)
router.use("/categories", authMiddleware.verifyToken, categoriesRouter)

module.exports = router