const Account = require("../../models/account.model")
const bcrypt = require("bcryptjs")
const Role = require("../../models/role.model")
const Order = require("../../models/order.model")
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  }
  if (req.query.keyword) {
    const keyword = req.query.keyword

    find.$or = [
      { firstname: { $regex: keyword, $options: "i" } },
      { lastname: { $regex: keyword, $options: "i" } }
    ]
  }

  if (req.query.role) {
    find.role = req.query.role
  }

  // Phân trang

  const limitItems = 9;
  let page = 1;

  if (req.query.page) {
    const currentPage = parseInt(req.query.page);
    if (!isNaN(currentPage) && currentPage > 0) {
      page = currentPage;
    }
  }

  const totalRecord = await Account.countDocuments(find);
  const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1); // nếu total page < 1 thì = 1 >  1 thì giữ nguyên
  if (page > totalPage) {
    page = totalPage;
  }

  const skip = (page - 1) * limitItems; // bỏ qua bao nhiêu record
  const accountList = await Account.find(find)
    .sort({ name: "asc" })
    .limit(limitItems)
    .skip(skip).populate('role', 'name')

  const pagination = {
    currentPage: page,
    totalPage: totalPage,
    skip: skip,
    totalRecord: totalRecord
  };
  for (let user of accountList) {
    user.totalOrder = await Order.countDocuments({
      deleted: false,
      userId: user._id
    });
  }

  const roleList = await Role.find({ deleted: false })
  res.render("admin/pages/users", {
    accountList: accountList,
    roleList: roleList,
    pagination: pagination,

  })
}

module.exports.openAddModal = async (req, res) => {
  const accountList = await Account.find({ deleted: false }).populate('role', 'name')

  const roleList = await Role.find({ deleted: false })
  res.render("admin/pages/users", {
    title: "Danh sách người dùng",
    accountList: accountList,
    roleList: roleList,
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
module.exports.openEditModal = async (req, res) => {
  const roleList = await Role.find({ deleted: false })
  const accountDetail = await Account.findOne({
    _id: req.params.id,
    deleted: false
  })
  const accountList = await Account.find({ deleted: false }).populate('role')

  res.render("admin/pages/users", {
    title: "Danh sách người dùng",
    accountDetail: accountDetail,
    roleList: roleList,
    accountList: accountList,
    openEditModal: true,
  })
}
module.exports.edit = async (req, res) => {
  try {
    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }
    const account = await Account.findOne({
      _id: req.params.id,
      deleted: false
    })
    if (!account) {
      res.json({
        code: "error",
        message: "Không tìm thấy tài khoản!"
      })
      return
    }
    req.body.updatedBy = req.user.id
    const salt = await bcrypt.genSalt(10); // Tạo ra chuỗi ngẫu nhiên có 10 ký tự
    req.body.password = await bcrypt.hash(req.body.password, salt);
    console.log(req.body)
    await Account.updateOne({ _id: req.params.id }, req.body)

    req.flash("success", "Cập nhật thành công!")
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
module.exports.delete = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      deleted: false
    })
    if (!account) {
      res.json({
        code: "error",
        message: "Không tìm thấy tài khoản!"
      })
      return
    }
    await Account.updateOne({ _id: req.params.id }, {
      deleted: true,
      updatedBy: req.user.id
    })
    req.flash("success", "Xoá thành công!")
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