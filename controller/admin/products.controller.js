const Product = require("../../models/products.model")
const Category = require("../../models/category.model")
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  }
  if (req.query.keyword) {
    const keyword = req.query.keyword
    find.name = {
      $regex: keyword,
      $options: "i"
    }
  }
  if (req.query.status) {
    find.status = req.query.status
  }
  const product = await Product.find(find).populate("category", "name")
  const categories = await Category.find({
    deleted: false,
    status: "active"
  })

  res.render("admin/pages/products", {
    title: "Sản phẩm",
    product: product,
    categories: categories
  })
}
module.exports.openAddModal = async (req, res) => {
  const product = await Product.find({
    deleted: false,
  })
  res.render("admin/pages/products", {
    title: "Sản phẩm",
    openAddModal: true,
    product: product,
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
module.exports.openEditModal = async (req, res) => {
  const product = await Product.find({
    deleted: false,
  })
  const categories = await Category.find({
    deleted: false,
    status: "active"
  })
  const productDetail = await Product.findOne({
    _id: req.params.id,
    deleted: false
  })
  res.render("admin/pages/products", {
    title: "Sản phẩm",
    openEditModal: true,
    product: product,
    productDetail: productDetail,
    categories: categories,
  })
}
module.exports.edit = async (req, res) => {
  try {

    if (req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }
    if (req.files && req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map(file => file.path);
    } else {
      delete req.body.images;
    }
    await Product.updateOne({ _id: req.params.id }, req.body)
    console.log(req.body)
    req.flash("success", "Cập nhật thành công")
    res.json({
      code: "success"
    })
  } catch (error) {
    console.log(error)
    req.flash("error", "Cập nhật thất bại")
    res.json({
      code: "error"
    })
  }

}
module.exports.delete = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      deleted: false
    })
    if (!product) {
      res.json({
        code: "error",
        message: "Không tìm thấy sản phẩm!"
      })
      return
    }
    await Product.updateOne({ _id: req.params.id }, {
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
