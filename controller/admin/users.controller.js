const Account = require("../../models/account.model")
const bcrypt = require("bcryptjs")
module.exports.index = async (req, res) => {
  const accountList = await Account.find({
    deleted: false,

  })
  res.render("admin/pages/users", {
    accountList: accountList
  })
}

module.exports.openAddModal = async (req, res) => {
  const accountList = await Account.find({ deleted: false })
  res.render("admin/pages/users", {
    title: "Danh sách người dùng",
    accountList: accountList,
    openAddModal: true,
  })
}

module.exports.add = async (req, res) => {
  try {
    if (req.file) {
      req.body.avatar = req.file.path;
    }
    const exitAccount = await Account.findOne({
      email: req.body.email,
    })
    if (exitAccount) {
      res.json({
        code: "error",
        message: "Email đã tồn tại!"
      })
      return
    }
    req.body.createdBy = req.user.id
    req.body.updatedBy = req.user.id
    const salt = await bcrypt.genSalt(10); // Tạo ra chuỗi ngẫu nhiên có 10 ký tự
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const account = new Account(req.body)
    await account.save()
    req.flash("success", "Thêm mới thành công!")
    res.json({
      code: "success"
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: "error",
      message: "Lỗi server!"
    })
  }
}