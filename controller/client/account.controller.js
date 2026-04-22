const bcrypt = require("bcryptjs")
const generateHelper = require("../../helpers/generate.helper")
const mailHelper = require("../../helpers/mail.helper")
const Account = require("../../models/account.model")
const ForgotPassword = require("../../models/forgot-password.model")
module.exports.login = async (req, res) => {
    res.render("client/pages/login", {
        title: "Dang nhap"
    })
}
module.exports.loginPost = async (req, res) => {
    const {
        email,
        password,
        rememberPasseword
    } = req.body
    const exitAccount = await Account.findOne({
        email: email
    })
    if (!exitAccount) {
        req.flash("error", "Không tìm thấy Email")
        res.json({
            code: "error"
        })
    }
    const isValidPass = bcrypt.compareSync(password, exitAccount.password); // check mật khẩu
    if (!isValidPass) {
        req.flash("error", "Sai mật khẩu")
        res.json({
            code: "error"
        })
    }
    req.flash("success", "Đăng nhập thành công")
    res.json({
        code: "success",

    })
}
module.exports.register = async (req, res) => {
    res.render("client/pages/register", {
        title: "Dang ky"
    })
}
module.exports.registerPost = async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        phone
    } = req.body
    const exitAccount = await Account.findOne({
        email: email
    })

    if (exitAccount) {
        req.flash("error", "Email đã tồn tại")
        res.json({
            code: "error",

        })
        return
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const newAccount = new Account({
        email: email,
        password: hashPassword,
        firstName: firstName,
        lastName: lastName,
        phone: phone
    })

    await newAccount.save()
    req.flash("success", "Đăng kí thành công")

    res.json({
        code: "success",

    })
}

module.exports.setting = async (req, res) => {
    res.render("client/pages/setting", {
        title: "Cai dat tai khoan"
    })
}

module.exports.information = async (req, res) => {
    res.render("client/pages/information", {
        title: "Thong tin tai khoan"
    })
}

module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/reset-password", {
        title: "Dat lai mat khau"
    })
}

module.exports.notification = async (req, res) => {
    res.render("client/pages/notification", {
        title: "Thong bao"
    })
}

module.exports.ordersHistory = async (req, res) => {
    res.render("client/pages/order-history", {
        title: "Lich su don hang"
    })
}

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/forgot-password", {
        title: "Quen mat khau",
        step: 1
    })
}
module.exports.forgotPasswordPost = async (req, res) => {
    const { email } = req.body
    const exsitAccount = await Account.findOne({
        email: email
    })
    if (!exsitAccount) {
        req.flash("error", "Email không tồn tại")
        res.json({
            code: "error",
        })
        return
    }
    const exitEmail = await ForgotPassword.findOne({
        email: email
    })
    if (exitEmail) {
        req.flash("error", "Email đã tồn tại")
        res.json({
            code: "error",
        })
        return
    }
    const otp = generateHelper.generateOTP()
    const newForgotPassword = new ForgotPassword({
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + 5 * 60 * 1000) // 5 phút
    })
    await newForgotPassword.save()
    req.flash("success", "Mã OTP đã được gửi đến email của bạn")
    res.json({
        code: "success",
    })
    mailHelper.sendMail(email, otp);
}
module.exports.otpPassword = async (req, res) => {
    res.render("client/pages/otp-password", {
        title: "Quen mat khau",
        step: 2
    })
}
module.exports.otpPasswordPost = async (req, res) => {
    const { otp, email } = req.body
    const forgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    })
    console.log(email, otp);
    console.log(forgotPassword);
    if (!forgotPassword) {
        req.flash("error", "Mã OTP không hợp lệ")
        res.json({
            code: "error",
        })
        return
    }
    req.flash("success", "Mã OTP hợp lệ")
    res.json({
        code: "success",
    })
}
module.exports.resetPass = async (req, res) => {
    res.render("client/pages/resetpass", {
        title: "Dat lai mat khau",
        step: 3
    })
}