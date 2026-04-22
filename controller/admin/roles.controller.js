const index = (req, res) => {
  res.render("admin/pages/roles", {
    pageTitle: "Quản lý phân quyền",
    roles: [],
  })
}

const add = (req, res) => {
  res.render("admin/pages/roles-form", {
    pageTitle: "Tạo vai trò mới",
    role: null,
  })
}

const create = (req, res) => {
  res.redirect("/admin/roles")
}

const edit = (req, res) => {
  res.render("admin/pages/roles-form", {
    pageTitle: "Sửa vai trò",
    role: { id: req.params.id },
  })
}

const update = (req, res) => {
  res.redirect("/admin/roles")
}

const del = (req, res) => {
  res.redirect("/admin/roles")
}

module.exports = {
  index,
  add,
  create,
  edit,
  update,
  delete: del,
}