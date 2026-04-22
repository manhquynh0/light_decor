const index = (req, res) => {
  res.render("admin/pages/category", {
    pageTitle: "Quản lý danh mục",
    categories: [],
  })
}

const add = (req, res) => {
  res.render("admin/pages/categories-form", {
    pageTitle: "Thêm danh mục",
    category: null,
  })
}

const create = (req, res) => {
  res.redirect("/admin/categories")
}

const edit = (req, res) => {
  res.render("admin/pages/categories-form", {
    pageTitle: "Sửa danh mục",
    category: { id: req.params.id },
  })
}

const update = (req, res) => {
  res.redirect("/admin/categories")
}

const del = (req, res) => {
  res.redirect("/admin/categories")
}

module.exports = {
  index,
  add,
  create,
  edit,
  update,
  delete: del,
}