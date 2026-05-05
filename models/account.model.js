const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        firstname: String,
        lastname: String,
        avatar: String,
        email: String,
        phone: String,
        role: String,
        status: String,
        password: String,
        createdBy: String,
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

const Account = mongoose.model("Account", schema, "account")
module.exports = Account
