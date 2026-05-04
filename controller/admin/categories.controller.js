module.exports.index = async (req, res) => {
  res.render("admin/pages/category", {
    title: "Danh mục"
  })
}

module.exports.openAddModal = async (req, res) => {
  res.render("admin/pages/category", {
    title: "Danh mục",
    openAddModal: true,
  })
}

module.exports.add = async (req, res) => {
  
    console.log(req.body)
  
  req.flash("success", "Them thanh cong")
  res.json({
    code: "success"
  })
}



