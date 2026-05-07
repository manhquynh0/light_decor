const Product = require("../../models/products.model");
const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/categoryTree.helper");

module.exports.products = async (req, res) => {

    const products = await Product.find({
        deleted: false,
        status: "stock"
    });

    const categoryList = await Category.find({
        deleted: false,
        status: "active"
    }).lean();

    const categoryTree = categoryHelper
        .categoryTree(categoryList)
        .filter(item => item.children.length > 0);

    res.render("client/pages/products", {
        products,
        categoryTree
    });
};
module.exports.productDetail = async (req, res) => {
    res.render("client/pages/product-detail", {

    })
}