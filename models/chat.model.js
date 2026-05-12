const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        user_id: String, // ID của người dùng hoặc Session ID
        role: {
            type: String,
            enum: ["user", "model"],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["client", "admin"],
            default: "client"
        }
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema, "chats");

module.exports = Chat;
