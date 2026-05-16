const Product = require("../../models/products.model");
const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/categoryTree.helper");
const Review = require("../../models/review.model");
const Order = require("../../models/order.model");
const slugify = require('slugify');
module.exports.products = async (req, res) => {
    const find = {
        deleted: false,
        status: "stock"
    }

    if (req.query.category) {
        const categoryIds = req.query.category.split(",");
        find.category = {
            $in: categoryIds
        };
    }


    const priceFilter = {}
    if (req.query.priceMin || req.query.priceMax) {
        if (req.query.priceMin) {
            const priceMin = Number(req.query.priceMin);
            priceFilter.$gte = priceMin
        }
        if (req.query.priceMax) {
            const priceMax = Number(req.query.priceMax);
            priceFilter.$lte = priceMax
        }
    }
    if (Object.keys(priceFilter).length > 0) {
        find.priceNEW = priceFilter;
    }
    if (req.query.keyword) {
        find.$or = [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { slug: { $regex: slugify(req.query.keyword, { lower: true }) } }
        ];
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

    const skip = (page - 1) * limitItems;

    let products = [];
    let totalRecord = 0;

    // Lọc và Sắp xếp
    // Lọc và Sắp xếp
    let sort = { name: "asc" };

    if (req.query.status === "new") {
        sort = { createdAt: "desc" };
    }

    // Lấy toàn bộ sản phẩm theo điều kiện
    products = await Product.find(find)
        .sort(sort)
        .limit(limitItems)
        .skip(skip)
        .lean();
    totalRecord = await Product.countDocuments(find);
    // Nếu lọc khuyến mãi
    if (req.query.status === "promotion") {

        // Chỉ lấy sản phẩm có giảm giá
        products = products.filter(item => {
            return item.priceOLD > item.priceNEW;
        });

        // Sắp xếp theo % giảm giá cao nhất
        products.sort((a, b) => {

            const discountA =
                ((a.priceOLD - a.priceNEW) / a.priceOLD) * 100;

            const discountB =
                ((b.priceOLD - b.priceNEW) / b.priceOLD) * 100;

            return discountB - discountA;

        });
    }


    const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1);
    if (page > totalPage) {
        page = totalPage;
    }

    const pagination = {
        currentPage: page,
        totalPage: totalPage,
        skip: skip,
        totalRecord: totalRecord
    };


    const categoryList = await Category.find({
        deleted: false,
        status: "active"
    }).lean();

    const categoryTree = categoryHelper
        .categoryTree(categoryList)
        .filter(item => item.children.length > 0);

    if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.json({
            products: products,
            pagination: pagination
        });
    }

    res.render("client/pages/products", {
        products,
        categoryTree,
        pagination,
    });
};

module.exports.productDetail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({ slug: slug }).populate("category", "name").lean();
    if (!product) return res.redirect("/products");

    const categoryIDs = product.category.map(item => (item._id ? item._id.toString() : item.toString()));
    const productList = await Product.find({
        _id: { $ne: product._id },
        deleted: false,
        status: "stock",
        category: {
            $in: categoryIDs
        },
    }).limit(4).populate("category", "name").lean();
    const listReview = await Review.find({
        productId: product._id,
    }).populate("userId")

    for (let item of listReview) {
        item.createdAtFormat = item.createdAt.toLocaleString('vi-VN')
    }

    const ratingTotal = listReview.reduce((total, item) => total + item.rating, 0);
    const ratingAvg = listReview.length > 0 ? ratingTotal / listReview.length : 0;
    let purchasedProductIds = [];
    if (req.user) {
        const orders = await Order.find({
            userId: req.user.id,
            deleted: false
        }).lean();

        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    purchasedProductIds.push(item.productId.toString());
                });
            }
        });
    }
    res.render("client/pages/product-detail", {
        product,
        productList,
        listReview,
        ratingAvg,
        order: purchasedProductIds
    })
}

module.exports.review = async (req, res) => {
    try {
        req.body.userId = req.user ? req.user.id : "";

        if (req.files && req.files.images && req.files.images.length > 0) {
            req.body.images = req.files.images.map(file => file.path);
        } else {
            delete req.body.images;
        }
        const reviewNew = new Review(req.body);
        await reviewNew.save();

        res.json({ code: "success" });
    } catch (error) {
        res.json({ code: "error", message: error.message });
    }
}