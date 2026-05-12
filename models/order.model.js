const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        orderCode: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        note: String,
        method: String,
        items: Array,
        subTotal: Number,
        couponCode: String,
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon"
        },
        discount: {
            type: Number,
            default: 0
        },
        total: Number,
        paymentMethod: String,
        paymentStatus: String,
        status: String,
        updatedBy: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: String,
        deletedAt: Date
    },
    {
        timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
    }
);

const Order = mongoose.model('Order', schema, "orders");

module.exports = Order;