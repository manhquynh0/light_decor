const index = (req, res) => {
  res.render("admin/pages/products", {
    pageTitle: "Quản lý sản phẩm",
    products: [],
  })
}

const add = (req, res) => {
  res.render("admin/pages/products-form", {
    pageTitle: "Thêm sản phẩm",
    product: null,
  })
}

const create = (req, res) => {
  // Xử lý tạo sản phẩm
  res.redirect("/admin/products")
}

const edit = (req, res) => {
  res.render("admin/pages/products-form", {
    pageTitle: "Sửa sản phẩm",
    product: { id: req.params.id },
  })
}

const update = (req, res) => {
  res.redirect("/admin/products")
}

const del = (req, res) => {
  res.redirect("/admin/products")
}

module.exports = {
  index,
  add,
  create,
  edit,
  update,
  delete: del,
}