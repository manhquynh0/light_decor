const Product = require("../../models/products.model")
const Category = require("../../models/category.model")
const categoryHelper = require("../../helpers/categoryTree.helper")
const slugify = require("slugify")
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  }
  if (req.query.keyword) {
    find.$or = [
      { name: { $regex: req.query.keyword, $options: "i" } },
      { slug: { $regex: slugify(req.query.keyword, { lower: true }) } }
    ];
  }
  if (req.query.status) {
    find.status = req.query.status
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

  const totalRecord = await Product.countDocuments(find);
  const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1); // nếu total page < 1 thì = 1 >  1 thì giữ nguyên
  if (page > totalPage) {
    page = totalPage;
  }

  const skip = (page - 1) * limitItems; // bỏ qua bao nhiêu record
  const product = await Product.find(find)
    .sort({ name: "asc" })
    .limit(limitItems)
    .skip(skip).populate("category", "name");

  const pagination = {
    currentPage: page,
    totalPage: totalPage,
    skip: skip,
    totalRecord: totalRecord
  };
  const allCategories = await Category.find({
    deleted: false
  })
  const categoryTree = categoryHelper.categoryTree(allCategories)
  res.render("admin/pages/products", {
    title: "Sản phẩm",
    product: product,
    categoryTree: categoryTree,
    pagination: pagination
  })
}
module.exports.openAddModal = async (req, res) => {
  const allCategories = await Category.find({
    deleted: false
  })
  const categoryTree = categoryHelper.categoryTree(allCategories)
  const product = await Product.find({
    deleted: false,
  })
  res.render("admin/pages/products", {
    title: "Sản phẩm",
    openAddModal: true,
    product: product,
    categoryTree: categoryTree
  })
}
module.exports.add = async (req, res) => {
  try {
    req.body.priceOLD = req.body.priceOLD ? parseInt(req.body.priceOLD) : 0
    req.body.priceNEW = req.body.priceNEW ? parseInt(req.body.priceNEW) : 0
    req.body.stock = req.body.stock ? parseInt(req.body.stock) : 0

    if (req.body.category) {
      if (!Array.isArray(req.body.category)) {
        req.body.category = [req.body.category];
      }
    }
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

    res.json({
      code: "success"
    })

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
  const allCategories = await Category.find({
    deleted: false
  })
  const categoryTree = categoryHelper.categoryTree(allCategories)
  const productDetail = await Product.findOne({
    _id: req.params.id,
    deleted: false
  })
  res.render("admin/pages/products", {
    title: "Sản phẩm",
    openEditModal: true,
    product: product,
    productDetail: productDetail,
    categoryTree: categoryTree,
  })
}
module.exports.edit = async (req, res) => {
  try {

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

    if (req.body.category) {
      if (!Array.isArray(req.body.category)) {
        req.body.category = [req.body.category];
      }
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
