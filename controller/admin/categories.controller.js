const Category = require("../../models/category.model")
const Account = require("../../models/account.model")
const categoryHelper = require("../../helpers/categoryTree.helper")
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }
  if (req.query.keyword) {
    find.slug = {
      $regex: req.query.keyword,
      $options: "i"
    }
  }
  // Lọc theo trạng thái
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

  const totalRecord = await Category.countDocuments(find);
  const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1); // nếu total page < 1 thì = 1 >  1 thì giữ nguyên
  if (page > totalPage) {
    page = totalPage;
  }

  const skip = (page - 1) * limitItems; // bỏ qua bao nhiêu record
  const categoryList = await Category.find(find)
    .sort({ name: "asc" })
    .limit(limitItems)
    .skip(skip);

  const pagination = {
    currentPage: page,
    totalPage: totalPage,
    skip: skip,
    totalRecord: totalRecord
  };
  for (let item of categoryList) {
    if (item.createdBy) {
      const infoUserCreated = await Account.findOne({
        _id: item.createdBy
      })
      item.createdByFullName = infoUserCreated ? infoUserCreated.fullname : ""
    } else {
      item.createdByFullName = ""
    }
    if (item.updatedBy) {
      const infoUserUpdated = await Account.findOne({
        _id: item.updatedBy
      })
      item.updatedByFullName = infoUserUpdated ? infoUserUpdated.fullname : ""
    } else {
      item.updatedByFullName = ""
    }
    item.createdAtFormat = item.createdAt ? item.createdAt.toLocaleString("vi-VN") : ""
    item.updatedAtFormat = item.updatedAt ? item.updatedAt.toLocaleString("vi-VN") : ""
  }
  const allCategories = await Category.find({
    deleted: false
  })
  const categoryTree = categoryHelper.categoryTree(allCategories)

  res.render("admin/pages/category", {
    title: "Danh mục",
    categoryList: categoryList,
    categoryTree: categoryTree,
    pagination: pagination
  })

}

module.exports.openAddModal = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  })
  const categoryTree = categoryHelper.categoryTree(categoryList)
  console.log(categoryTree)
  res.render("admin/pages/category", {
    title: "Danh mục",
    categoryList: categoryList,
    categoryTree: categoryTree,
    openAddModal: true
  })
}

module.exports.add = async (req, res) => {
  try {
    console.log(req.body)
    req.body.createdBy = req.user.id
    req.body.updatedBy = req.user.id
    const newRecord = new Category(req.body)
    await newRecord.save()
    req.flash("success", "Thêm thành công")
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
  const categoryDetail = await Category.findOne({
    _id: req.params.id,
    deleted: false
  })
  const categoryList = await Category.find({
    deleted: false
  })
  const categoryTree = categoryHelper.categoryTree(categoryList)
  res.render("admin/pages/category", {
    title: "Danh mục",
    categoryList: categoryList,
    categoryTree: categoryTree,
    categoryDetail: categoryDetail,
    openEditModal: true
  })
}
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    await Category.updateOne(
      { _id: id },
      req.body
    )
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
    const id = req.params.id
    await Category.updateOne(
      { _id: id },
      { deleted: true }
    )
    req.flash("success", "Xoá thành công")
    res.json({
      code: "success"
    })
  } catch (error) {
    console.log(error)
    req.flash("error", "Xoá thất bại")
    res.json({
      code: "error"
    })
  }
}
