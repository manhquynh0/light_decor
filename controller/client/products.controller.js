const Product = require("../../models/products.model");
const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/categoryTree.helper");

module.exports.products = async (req, res) => {
    const find = {
        deleted: false,
        status: "stock"
    }
    //loc theo gia
    const priceFilter = {}
    if (req.query.priceMin || req.query.priceMax) {
        if (req.query.priceMin) {
            const priceMin = req.query.priceMin
            priceFilter.$gte = priceMin
        }
        if (req.query.priceMax) {
            const priceMax = req.query.priceMax
            priceFilter.$lte = priceMax
        }
    }
    if (Object.keys(priceFilter).length > 0) {
        find.priceNEW = priceFilter;
    }
    if (req.query.keyword) {
        find.name = {
            $regex: req.query.keyword,
            $options: "i"
        }
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
    if (req.query.status === "promotion") {
        const aggregatePipeline = [
            { $match: find },
            {
                $addFields: {
                    // Chuyển đổi giá sang số, xử lý trường hợp có dấu chấm phân cách
                    priceOLD_clean: { $replaceAll: { input: { $ifNull: ["$priceOLD", "0"] }, find: ".", replacement: "" } },
                    priceNEW_clean: { $replaceAll: { input: { $ifNull: ["$priceNEW", "0"] }, find: ".", replacement: "" } }
                }
            },
            {
                $addFields: {
                    priceOLD_num: { $convert: { input: "$priceOLD_clean", to: "int", onError: 0, onNull: 0 } },
                    priceNEW_num: { $convert: { input: "$priceNEW_clean", to: "int", onError: 0, onNull: 0 } }
                }
            },
            {
                $addFields: {
                    // Tính % giảm giá: ((Old - New) / Old) * 100
                    discountPercent: {
                        $cond: [
                            { $gt: ["$priceOLD_num", 0] },
                            {
                                $floor: {
                                    $multiply: [
                                        { $divide: [{ $subtract: ["$priceOLD_num", "$priceNEW_num"] }, "$priceOLD_num"] },
                                        100
                                    ]
                                }
                            },
                            0
                        ]
                    }
                }
            },
            { $match: { discountPercent: { $gt: 0 } } },
            { $sort: { discountPercent: -1 } }, // Sắp xếp theo % giảm giá cao nhất
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [{ $skip: skip }, { $limit: limitItems }]
                }
            }
        ];

        const result = await Product.aggregate(aggregatePipeline);
        products = result[0].data;
        totalRecord = result[0].metadata[0] ? result[0].metadata[0].total : 0;
    } else {
        // Các trường hợp khác dùng find() thông thường
        let sort = { name: "asc" };
        if (req.query.status === "new") {
            sort = { createdAt: "desc" };
        }

        totalRecord = await Product.countDocuments(find);
        products = await Product.find(find)
            .sort(sort)
            .limit(limitItems)
            .skip(skip);
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

    res.render("client/pages/products", {
        products,
        categoryTree,
        pagination,
    });
};
module.exports.productDetail = async (req, res) => {
    res.render("client/pages/product-detail", {

    })
}