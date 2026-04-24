const accountController = require("../../controller/client/account.controller")
const authMiddleware = require("../../middlewares/auth.middlware")
const router = require("express").Router()
router.get("/login", accountController.login)
router.post("/login", accountController.loginPost)

router.post("/login-google", accountController.loginGoogle)

router.get("/register", accountController.register)
router.post("/register", accountController.registerPost)

router.get("/setting/information", authMiddleware.verifyToken, accountController.information)

router.get("/setting/reset-password", authMiddleware.verifyToken, accountController.resetPassword)

router.get("/setting/notification", authMiddleware.verifyToken, accountController.notification)

router.get("/setting/orders-history", authMiddleware.verifyToken, accountController.ordersHistory)

router.get("/logout", accountController.logout)

router.get("/forgot-password", accountController.forgotPassword)
router.post("/forgot-password", accountController.forgotPasswordPost)

router.get("/otp-password", accountController.otpPassword)
router.post("/otp-password", accountController.otpPasswordPost)

router.get("/resetpass", accountController.resetPass)
router.post("/resetpass/:email", accountController.resetPassPost)

module.exports = router
