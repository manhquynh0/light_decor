module.exports.login = async (req, res) => {
    res.render("client/pages/login", {
        title: "Trang chủ"
    })
}
module.exports.loginPost = async (req, res) => {
    res.json({
        code: "success",
        message: "Đăng nhập thành công"
    })
}
module.exports.register = async (req, res) => {
    res.render("client/pages/register", {
        title: "Trang chủ"
    })
}
module.exports.setting = async (req, res) => {
    res.render("client/pages/setting", {
        title: "Trang chủ"
    })
}
module.exports.information = async (req, res) => {
    res.render("client/pages/information", {
        title: "Trang chủ"
    })
}
module.exports.resetPass = async (req, res) => {
    res.render("client/pages/reset-password", {
        title: "Trang chủ"
    })
}
module.exports.notification = async (req, res) => {
    res.render("client/pages/notification", {
        title: "Trang chủ"
    })
}
module.exports.ordersHistory = async (req, res) => {
    res.render("client/pages/order-history", {
        title: "Lịch Sử Đơn hàng"
    })
}