const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    rating: Number, // số sao 1-5
    content: String,
    images: Array,
}, {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
});

module.exports = mongoose.model("Review", reviewSchema, "reviews");