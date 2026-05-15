const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const generateHelper = require("../../helpers/generate.helper")
const mailHelper = require("../../helpers/mail.helper")
const Account = require("../../models/account.model")
const ForgotPassword = require("../../models/forgot-password.model")
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Order = require("../../models/order.model")
const Product = require("../../models/products.model")
const Coupon = require("../../models/coupon.model")
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
            rememberPassword
        } = req.body
        const exitAccount = await Account.findOne({
            email: email
        })
        if (!exitAccount) {
            req.flash("error", "Không tìm thấy Email")
            return res.json({
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
            expiresIn: rememberPassword ? "7d" : "1d" // gán thời gian hết hạn của token
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
                fullname: payload.name,
                firstname: payload.given_name || "",
                lastname: payload.family_name || "",
                email: payload.email,
                avatar: payload.picture,
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
    try {
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
            return res.json({
                code: "error",
                message: "Email da ton tai"
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        const newAccount = new Account({
            email: email,
            password: hashPassword,
            fullname: `${firstName} ${lastName}`.trim(),
            firstname: firstName,
            lastname: lastName,
            phone: phone
        })


        await newAccount.save()
        req.flash("success", "Đăng kí thành công")

        return res.json({
            code: "success",
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            code: "error",
            message: "Loi server khi dang ki"
        })
    }
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
module.exports.informationPost = async (req, res) => {
    const { email } = req.body
    const exitAccount = await Account.findOne({
        _id: req.user.id,
        deleted: false
    })
    if (!exitAccount) {
        req.flash("error", "Không tìm thấy tài khoản")
        res.json({
            code: "error"
        })
        return
    }

    if (req.body.password && req.body.password.trim() !== "") {
        const salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);
    } else {
        delete req.body.password;
    }

    await Account.updateOne({
        _id: req.user.id
    }, req.body)

    req.flash("success", "Cập nhật thành công")
    res.json({
        code: "success"
    })
}

module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/reset-password", {
        title: "Dat lai mat khau"
    })
}

module.exports.notification = async (req, res) => {
    const now = new Date()
    const coupons = await Coupon.find({
        deleted: false,
        isActive: true,
        $or: [
            { expireAt: null },
            { expireAt: { $gt: now } }
        ]
    }).sort({ createdAt: "desc" })

    res.render("client/pages/notification", {
        title: "Thông báo",
        coupons: coupons
    })
}

module.exports.ordersHistory = async (req, res) => {
    const find = {
        deleted: false,
        userId: req.user._id
    }
    if (req.query.keyword) {
        find.orderCode = {
            $regex: req.query.keyword,
            $options: "i"
        }
    }
    // Lọc theo trạng thái
    if (req.query.status) {
        find.status = req.query.status
    }

    // Phân trang

    const limitItems = 5;
    let page = 1;

    if (req.query.page) {
        const currentPage = parseInt(req.query.page);
        if (!isNaN(currentPage) && currentPage > 0) {
            page = currentPage;
        }
    }

    const totalRecord = await Order.countDocuments(find);
    const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1); // nếu total page < 1 thì = 1 >  1 thì giữ nguyên
    if (page > totalPage) {
        page = totalPage;
    }

    const skip = (page - 1) * limitItems; // bỏ qua bao nhiêu record
    const orderList = await Order.find(find)
        .sort({ createdAt: "desc" })
        .limit(limitItems)
        .skip(skip);

    const pagination = {
        currentPage: page,
        totalPage: totalPage,
        skip: skip,
        totalRecord: totalRecord
    };

    for (let item of orderList) {
        item.createdAtFormat = item.createdAt.toLocaleString('vi-VN')
    }
    const products = await Product.find({
        deleted: false
    })
    res.render("client/pages/order-history", {
        title: "Lich su don hang",
        orderList: orderList,
        pagination: pagination,
        products: products
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

module.exports.resetPasswordPost = async (req, res) => {
    const { currentPass, newPass } = req.body
    const account = await Account.findOne({
        email: req.user.email
    })
    if (!account) {
        req.flash("error", "Tài khoản không tồn tại")
        res.json({
            code: "error",
        })
        return
    }
    if (!bcrypt.compareSync(currentPass, account.password)) {
        req.flash("error", "Mật khẩu hiện tại không chính xác")
        res.json({
            code: "error",
        })
        return
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(newPass, salt);
    await Account.updateOne({
        email: req.user.email
    }, {
        password: hashPassword
    })
    req.flash("success", "Đã đặt lại mật khẩu thành công")
    res.json({
        code: "success",
    })
}
