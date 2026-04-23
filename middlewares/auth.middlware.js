const jwt = require("jsonwebtoken")
const Account = require("../models/account.model")
module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            res.redirect('/account/login')
            req.flash("error", "Bạn chưa đăng nhập")
            return
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id, email } = decoded
        const account = await Account.findOne({
            _id: id,
            email: email
        })
        if (!account) {
            res.clearCookie('token')
            res.redirect('/account/login')
            req.flash("error", "Bạn chưa đăng nhập")
            return
        }
        req.user = account
        res.locals.user = account
        next()
    }
    catch (error) {
        res.clearCookie('token')
        res.redirect('/account/login')
        req.flash("error", "Bạn chưa đăng nhập")
        return
    }
}

module.exports.verifyTokenOptional = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            // Không có token, bỏ qua
            next()
            return
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id, email } = decoded
        const account = await Account.findOne({
            _id: id,
            email: email
        })
        if (account) {
            req.user = account
            res.locals.user = account
        }
        next()
    }
    catch (error) {
        // Token không hợp lệ, bỏ qua
        next()
    }
}
