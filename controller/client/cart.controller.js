const Product = require("../../models/products.model")
const generateHelper = require("../../helpers/generate.helper")
const Order = require("../../models/order.model")
const Coupon = require("../../models/coupon.model")

module.exports.cart = async (req, res) => {
    res.render("client/pages/cart", {

    })
}
module.exports.payment = async (req, res) => {
    const now = new Date();
    // Lấy tất cả mã giảm giá đang hoạt động và chưa hết hạn
    const coupons = await Coupon.find({
        deleted: false,
        isActive: true,
        $or: [
            { expireAt: null },
            { expireAt: { $gt: now } }
        ]
    }).sort({ createdAt: "desc" });

    res.render("client/pages/payment", {
        coupons: coupons
    })
}

module.exports.applyCoupon = async (req, res) => {
    try {
        const { code, subTotal } = req.body;
        const now = new Date();

        const coupon = await Coupon.findOne({
            code: code.toUpperCase().trim(),
            deleted: false,
            isActive: true,
            $or: [
                { expireAt: null },
                { expireAt: { $gt: now } }
            ]
        });

        if (!coupon) {
            return res.json({
                code: "error",
                message: "Mã giảm giá không hợp lệ hoặc đã hết hạn!"
            });
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.json({
                code: "error",
                message: "Mã giảm giá đã hết lượt sử dụng!"
            });
        }

        if (subTotal < coupon.minOrderValue) {
            return res.json({
                code: "error",
                message: `Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ để sử dụng mã này!`
            });
        }

        let discount = 0;
        if (coupon.discountType === "percent") {
            discount = (subTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        // Đảm bảo giảm giá không vượt quá giá trị đơn hàng
        if (discount > subTotal) discount = subTotal;

        res.json({
            code: "success",
            discount: discount,
            message: "Áp dụng mã giảm giá thành công!"
        });

    } catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Có lỗi xảy ra khi áp dụng mã giảm giá!"
        });
    }
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
            item.price = infor.priceNEW ? parseInt(String(infor.priceNEW).replace(/\./g, '')) : 0;
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
        const subTotal = req.body.items.reduce((sum, item) => {
            return sum + (item.price * parseInt(item.quantity));
        }, 0);

        req.body.subTotal = subTotal;

        // Xử lý giảm giá
        let discount = 0;
        if (req.body.couponCode) {
            const now = new Date();
            const coupon = await Coupon.findOne({
                code: req.body.couponCode.toUpperCase().trim(),
                deleted: false,
                isActive: true,
                $or: [
                    { expireAt: null },
                    { expireAt: { $gt: now } }
                ]
            });

            if (coupon && subTotal >= coupon.minOrderValue && (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit)) {
                if (coupon.discountType === "percent") {
                    discount = (subTotal * coupon.discountValue) / 100;
                    if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
                        discount = coupon.maxDiscount;
                    }
                } else {
                    discount = coupon.discountValue;
                }
                
                if (discount > subTotal) discount = subTotal;
                
                req.body.discount = discount;
                req.body.couponId = coupon._id;

                // Tăng lượt sử dụng coupon
                await Coupon.updateOne({ _id: coupon._id }, {
                    $inc: { usedCount: 1 }
                });
            } else {
                req.body.discount = 0;
                req.body.couponCode = "";
            }
        } else {
            req.body.discount = 0;
        }

        // Thanh toán
        req.body.total = req.body.subTotal - (req.body.discount || 0);

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
