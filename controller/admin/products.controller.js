const Product = require("../../models/products.model")
const Category = require("../../models/category.model")
module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false
  }).populate("category", "name")
  const categories = await Category.find({
    deleted: false,
    status: "active"
  })

  res.render("admin/pages/products", {
    title: "Sản phẩm",
    products: products,
    categories: categories
  })
}
module.exports.openAddModal = async (req, res) => {
  res.render("admin/pages/products", {
    title: "Sản phẩm",
    openAddModal: true,
  })
}
module.exports.add = async (req, res) => {
  try {
    req.body.priceOLD = req.body.priceOLD ? parseInt(req.body.priceOLD) : 0
    req.body.priceNEW = req.body.priceNEW ? parseInt(req.body.priceNEW) : 0
    req.body.stock = req.body.stock ? parseInt(req.body.stock) : 0
    if (req.files && req.files.avatar) {
      req.body.avatar = req.files.avatar[0].path;
    } else {
      delete req.body.avatar;
    }
    if (req.files && req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(file => file.path);
    } else {
      delete req.body.images;
    }
    const newRecord = new Product(req.body)
    await newRecord.save()
    req.flash("success", "Thêm thành công")
    res.json({
      code: "success"
    })
    console.log(req.body)
  } catch (error) {
    console.log(error)
    req.flash("error", "Thêm thất bại")
    res.json({
      code: "error"
    })
  }

}