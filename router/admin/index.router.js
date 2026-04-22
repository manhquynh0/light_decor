
const productsRouter = require("./products.router")
const usersRouter = require("./users.router")
const ordersRouter = require("./orders.router")
const rolesRouter = require("./roles.router")
const categoriesRouter = require("./categories.router")
const dashboardRouter = require("./dashboard.router")
const router = require("express").Router()


// Sub-routers
router.use("/dashboard", dashboardRouter)
router.use("/products", productsRouter)
router.use("/users", usersRouter)
router.use("/orders", ordersRouter)
router.use("/roles", rolesRouter)
router.use("/categories", categoriesRouter)

module.exports = router