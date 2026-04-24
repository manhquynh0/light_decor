const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const generateHelper = require("../../helpers/generate.helper")
const mailHelper = require("../../helpers/mail.helper")
const Account = require("../../models/account.model")
const ForgotPassword = require("../../models/forgot-password.model")
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
module.exports.login = async (req, res) => {
    res.render("client/pages/login", {
        title: "Dang nhap"
    })
}
module.exports.loginPost = async (req, res) => {
    try {
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
            return
        }
        const token = jwt.sign({
            id: exitAccount.id, // gán id vào token
            email: exitAccount.email // gán email vào token
        }, process.env.JWT_SECRET, { // gán JWT_SECRET vào token
            expiresIn: rememberPasseword ? "7d" : "1d" // gán thời gian hết hạn của token
        })
        res.cookie("token", token, {
            maxAge: rememberPassword ? (30 * 24 * 60 * 60 * 1000) : (24 * 60 * 60 * 1000), // luu duoi dang milisenconds
            httpOnly: true,// cookie chi co the truy cap boi may chu web
            sameSite: "strict"
        })
        console.log(req.cookies)
        req.flash("success", "Đăng nhập thành công")
        return res.json({
            code: "success",

        })
    }
    catch (error) {
        console.log(error)
        req.flash("error", "Đăng nhập thất bại")
        res.json({
            code: "error",
        })
    }
}
module.exports.loginGoogle = async (req, res) => {
    try {
        const { token } = req.body;

        // verify token từ Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // tìm user theo email
        let user = await Account.findOne({
            email: payload.email
        });

        // nếu chưa có thì tạo mới
        if (!user) {
            user = await Account.create({
                fullName: payload.name,
                email: payload.email,
                password: "", // Google login không cần password
            });
        }

        // tạo JWT giống login thường
        const jwtToken = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // lưu cookie
        res.cookie("token", jwtToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict"
        });
        req.flash("success", "Đăng nhập thành công")
        return res.json({
            code: "success",
        });

    } catch (err) {
        req.flash("error", "Đăng nhập thất bại")
        return res.json({
            code: "error",
        });
    }
};
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

module.exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.redirect('/account/login');
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
    const account = await Account.findOne({
        email: email
    })
    const token = jwt.sign({
        id: account.id,
        email: account.email
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    })
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
module.exports.resetPassPost = async (req, res) => {
    const { newPassword, email } = req.body
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(newPassword, salt);
    await Account.updateOne({
        email: email
    }, {
        password: hashPassword
    })
    req.flash("success", "Đã đặt lại mật khẩu thành công")
    res.json({
        code: "success",
    })
}
