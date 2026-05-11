const Product = require("../../models/products.model")
const generateHelper = require("../../helpers/generate.helper")
const Order = require("../../models/order.model")
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
module.exports.orderPost = async (req, res) => {
    try {
        req.body.orderCode = "OD" + generateHelper.generateRandomNumber(5);
        for (const item of req.body.items) {
            const infor = await Product.findOne({
                _id: item.productId,
                status: "stock",
                deleted: false
            })


            // Remove dots from priceNEW (e.g. "45.000.000" -> 45000000)
            item.price = infor.priceNEW ? parseInt(infor.priceNEW.replace(/\./g, '')) : 0;
            item.avatar = infor.avatar;
            item.name = infor.name;
            item.slug = infor.slug;


            const currentStock = parseInt(infor.stock || 0);
            const orderQuantity = parseInt(item.quantity || 0);

            if (currentStock < orderQuantity) {
                req.flash("error", "Số lượng của sản phẩm " + item.name + " đã hết, vui lòng chọn lại")
                res.json({
                    code: "error",

                })
                return;
            }


            await Product.updateOne({
                _id: item.productId
            }, {
                stock: (currentStock - orderQuantity)
            })
        }


        // Thanh toán
        // Tạm tính
        req.body.subTotal = req.body.items.reduce((sum, item) => {
            return sum + (item.price * parseInt(item.quantity));
        }, 0);

        // Giảm
        req.body.discount = 0;

        // Thanh toán
        req.body.total = req.body.subTotal - req.body.discount;

        // Trạng thái thanh toán
        if (req.body.method == "money") {
            req.body.paymentStatus = "unpaid";
        }
        else {
            req.body.paymentStatus = "paid";
        }

        // Trạng thái đơn hàng

        req.body.status = "initial"; // initial: khởi tạo, done: hoàn thành, cancel: hủy

        // Map method to paymentMethod
        req.body.userId = req.user._id;


        const newRecord = new Order(req.body);
        await newRecord.save();

        res.json({
            code: "success",
            orderId: newRecord._id
        })
    } catch (error) {
        console.log(error);

        res.json({
            code: "error",
            message: "Đặt hàng không thành công!"
        })
    }
}
