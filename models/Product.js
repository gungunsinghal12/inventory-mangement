
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"]
        },

        sku: {
            type: String,
            required: [true, "SKU is required"],
            unique: true
        },

        category: {
            type: String,
            required: [true, "Category is required"]
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        lowStockThreshold: {
            type: Number,
            default: 5,
            min: 0
        },

        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
