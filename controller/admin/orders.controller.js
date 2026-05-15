const Order = require("../../models/order.model");

module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }
  if (req.query.keyword) {
    find.orderCode = {
      $regex: req.query.keyword,
      $options: "i"
    }
  }
  // Lọc theo trạng thái
  if (req.query.status) {
    find.paymentStatus = req.query.status
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

  const totalRecord = await Order.countDocuments(find);
  const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1); // nếu total page < 1 thì = 1 >  1 thì giữ nguyên
  if (page > totalPage) {
    page = totalPage;
  }

  const skip = (page - 1) * limitItems; // bỏ qua bao nhiêu record
  const orderList = await Order.find(find)
    .sort({ createdAt: -1 })
    .limit(limitItems)
    .skip(skip);

  const pagination = {
    currentPage: page,
    totalPage: totalPage,
    skip: skip,
    totalRecord: totalRecord
  };

  for (let item of orderList) {
    item.createdAtFormat = item.createdAt ? item.createdAt.toLocaleString("vi-VN") : ""
  }
  res.render("admin/pages/orders", {
    pageTitle: "Quản lý đơn hàng",
    orderList,
    pagination: pagination
  });
};

module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Order.updateOne({ _id: id }, {
    deleted: true
  });
  req.flash("success", "Đã xóa đơn hàng thành công!");
  res.json({
    code: "success"

  })
}
module.exports.openOrderDetail = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    deleted: false
  })

  if (order) {
    order.createdAtFormat = order.createdAt ? order.createdAt.toLocaleString("vi-VN") : ""
  }
  const orderList = await Order.find({
    deleted: false
  })
  res.render("admin/pages/orders", {
    pageTitle: "Quản lý đơn hàng",
    orderDetail: order,
    openOrderDetail: true,
    orderList,
  })
}

module.exports.update = async (req, res) => {
  const { orderId, status } = req.body;
  await Order.updateOne({ _id: orderId }, {
    status: status
  });
  req.flash("success", "Đã cập nhật đơn hàng thành công!");
  res.json({
    code: "success"
  })
}
