const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)
const schema = new mongoose.Schema({
    name: String,
    status: String,
    avatar: String,
    power: String,
    made: String,
    size: String,
    colorIndex: String,
    material: String,
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    ],

    createdBy: String,
    priceOLD: Number,
    priceNEW: Number,
    updatedBy: String,
    images: Array,
    stock: String,
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
const Product = mongoose.model('Product', schema, "products")
module.exports = Product