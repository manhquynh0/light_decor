const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        option: String,
        note: String,
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

const Contact = mongoose.model('Contact', schema, "contacts");

module.exports = Contact;