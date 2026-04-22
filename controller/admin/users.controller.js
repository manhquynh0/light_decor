const index = (req, res) => {
  res.render("admin/pages/users", {
    pageTitle: "Quản lý người dùng",
    users: [],
  })
}

const add = (req, res) => {
  res.render("admin/pages/users-form", {
    pageTitle: "Thêm người dùng",
    user: null,
  })
}

const create = (req, res) => {
  res.redirect("/admin/users")
}

const edit = (req, res) => {
  res.render("admin/pages/users-form", {
    pageTitle: "Sửa người dùng",
    user: { id: req.params.id },
  })
}

const update = (req, res) => {
  res.redirect("/admin/users")
}

const del = (req, res) => {
  res.redirect("/admin/users")
}

module.exports = {
  index,
  add,
  create,
  edit,
  update,
  delete: del,
}