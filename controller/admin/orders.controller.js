const index = (req, res) => {
  res.render("admin/pages/orders", {
    pageTitle: "Quản lý đơn hàng",
    orders: [],
  })
}

const detail = (req, res) => {
  res.render("admin/pages/order-detail", {
    pageTitle: "Chi tiết đơn hàng",
    order: { id: req.params.id },
  })
}

const updateStatus = (req, res) => {
  res.redirect(`/admin/orders/${req.params.id}`)
}

const del = (req, res) => {
  res.redirect("/admin/orders")
}

module.exports = {
  index,
  detail,
  updateStatus,
  delete: del,
}