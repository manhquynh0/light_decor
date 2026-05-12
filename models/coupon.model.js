const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        discountType: {
            type: String,
            enum: ["percent", "fixed"],
            default: "percent"
        },
        discountValue: {
            type: Number,
            required: true
        },
        minOrderValue: {
            type: Number,
            default: 0
        },
        maxDiscount: {
            type: Number,
            default: null
        },
        expireAt: {
            type: Date,
            default: null
        },
        usageLimit: {
            type: Number,
            default: null
        },
        usedCount: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

const Coupon = mongoose.model("Coupon", couponSchema)
module.exports = Coupon
