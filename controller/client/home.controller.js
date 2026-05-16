const Product = require("../../models/products.model")
const categoryHelper = require("../../helpers/categoryTree.helper")

module.exports.home = async (req, res) => {
    try {
        const ProdHead = await Product.find({
            deleted: false,
            status: "stock"
        }).sort({ createdAt: "desc" }).limit(4)
        const products = await Product.find({
            deleted: false,
            status: "stock"
        }).limit(8)

        const modernID = "69fc3cc39d07cbe3f31df98a"
        const listCateID = await categoryHelper.getAllSubcateId(modernID)
        const listModernProducts = await Product.find({
            category: { $in: listCateID },
            deleted: false,
            status: "stock"
        }).limit(8)

        const classicID = "69fcce6f75893287293e6012"
        const listClassicID = await categoryHelper.getAllSubcateId(classicID)
        const listClassicProducts = await Product.find({
            category: { $in: listClassicID },
            deleted: false,
            status: "stock"
        }).limit(8)

        const simpleID = "69fcce8c75893287293e6013"
        const listSimpleID = await categoryHelper.getAllSubcateId(simpleID)
        const listSimpleProducts = await Product.find({
            category: { $in: listSimpleID },
            deleted: false,
            status: "stock"
        }).limit(8)

        const luxuryID = "69fcce9975893287293e6014"
        const listLuxuryID = await categoryHelper.getAllSubcateId(luxuryID)
        const listLuxuryProducts = await Product.find({
            category: { $in: listLuxuryID },
            deleted: false,
            status: "stock"
        }).limit(8)

        const livingID = "69fc3c5c9d07cbe3f31df987"
        const listLivingID = await categoryHelper.getAllSubcateId(livingID)
        const listLivingProducts = await Product.find({
            category: { $in: listLivingID },
            deleted: false,
            status: "stock"
        }).limit(8)
        const kittchenID = "69fd8e51b0b7bb79c1a43c2c"
        const listKittchenID = await categoryHelper.getAllSubcateId(kittchenID)
        const listKittchenProducts = await Product.find({
            category: { $in: listKittchenID },
            deleted: false,
            status: "stock"
        }).limit(8)
        res.render("client/pages/home", {
            title: "Trang chủ",
            products: products || [],
            listModernProducts: listModernProducts || [],
            listClassicProducts: listClassicProducts || [],
            listSimpleProducts: listSimpleProducts || [],
            listLuxuryProducts: listLuxuryProducts || [],
            listLivingProducts: listLivingProducts || [],
            listKittchenProducts: listKittchenProducts || [],
            ProdHead: ProdHead || []
        })
    } catch (error) {
        console.error("Error in home controller:", error)
        res.status(500).send("Internal Server Error")
    }
}

