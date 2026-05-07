const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const schema = new mongoose.Schema({
    name: String,
    status: String,
    avatar: String,
    parent: String,
    createdBy: String,
    updatedBy: String,
    slug: {
        type: String,
        slug: "name",// theo truong name
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: String,
    deletedAt: Date,
    description: String,
},
    {
        timestamps: true // TU DONG sinh ra truong creatAt va updateAt
    })
const Category = mongoose.model('Category', schema, "categories")
module.exports = Category