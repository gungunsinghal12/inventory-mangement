
const express = require("express");
const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    restockProduct,
    sellProduct,
    lowStockReport,
    categorySummary
} = require("../controller/productcontroller");

// Create product
router.post("/", createProduct);

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Update product
router.put("/:id", updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

// Restock product
router.patch("/:id/stock/add", restockProduct);

// Sell product
router.patch("/:id/stock/sell", sellProduct);

// Low stock report
router.get("/reports/low-stock", lowStockReport);

// Category summary
router.get("/reports/summary", categorySummary);

module.exports = router;
