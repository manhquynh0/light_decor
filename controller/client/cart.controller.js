const Product = require("../../models/products.model")
module.exports.cart = async (req, res) => {
    res.render("client/pages/cart", {

    })
}
module.exports.payment = async (req, res) => {
    res.render("client/pages/payment", {

    })
}
module.exports.paymentPost = async (req, res) => {
    const ProductPayment = req.body
    for (const item of ProductPayment) {
        const infor = await Product.findOne({
            _id: item.productId,
            status: "stock",
            deleted: false
        })
        if (infor) {
            item.avatar = infor.avatar
            item.name = infor.name
            item.price = infor.priceNEW
            item.slug = infor.slug
            item.size = item.size

        }

    }
    res.json({
        code: "success",
        ProductPayment: ProductPayment
    })


}
module.exports.detailCart = async (req, res) => {
    const cart = req.body
    if (!Array.isArray(cart)) {
        return res.json({
            code: "success",
            cart: []
        });
    }
    for (const item of cart) {
        const inforProduct = await Product.findOne({
            _id: item.productId,
            status: "stock",
            deleted: false
        })

        if (inforProduct) {
            item.avatar = inforProduct.avatar
            item.name = inforProduct.name
            item.price = inforProduct.priceNEW
            item.stock = inforProduct.stock
            item.slug = inforProduct.slug

        }
        else {
            const indexItem = cart.findIndex(item => item.productId == item.productId)
            cart.splice(indexItem, 1)
            req.flash("error", "Sản phẩm " + inforProduct.name + " không tồn tại")
            res.json({
                code: "error"
            })
            return;
        }

    }
    res.json({
        code: "success",
        cart: cart
    })
}