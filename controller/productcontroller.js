const Product = require("../models/product");

// 1. Create Product
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        next(error);
    }
};

// 2. Get All Products with Filtering, Sorting and Pagination
exports.getProducts = async (req, res, next) => {
    try {
        const { category, search, sort, page = 1, limit = 10 } = req.query;

        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const products = await Product.find(filter)
            .sort(sort || "name")
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            total,
            page: Number(page),
            products
        });
    } catch (error) {
        next(error);
    }
};

// 3. Get Single Product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

// 4. Update Product Details
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        next(error);
    }
};

// 5. Delete Product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// 6. Restock Product
exports.restockProduct = async (req, res, next) => {
    try {
        const quantity = Number(req.body.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be a positive whole number"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { quantity: quantity } },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Stock added successfully",
            product
        });
    } catch (error) {
        next(error);
    }
};

// 7. Sell Product
exports.sellProduct = async (req, res, next) => {
    try {
        const quantity = Number(req.body.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be a positive whole number"
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                quantity: { $gte: quantity }
            },
            { $inc: { quantity: -quantity } },
            { new: true }
        );

        if (!product) {
            return res.status(400).json({
                message: "Product not found or insufficient stock"
            });
        }

        res.status(200).json({
            message: "Product sold successfully",
            product
        });
    } catch (error) {
        next(error);
    }
};

// 8. Low Stock Report
exports.lowStockReport = async (req, res, next) => {
    try {
        const products = await Product.find({
            $expr: {
                $lte: ["$quantity", "$lowStockThreshold"]
            }
        });

        res.status(200).json({
            message: "Low stock products",
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
};

// 9. Category-wise Inventory Summary
exports.categorySummary = async (req, res, next) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalProducts: { $sum: 1 },
                    totalStock: { $sum: "$quantity" },
                    totalValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            message: "Category-wise inventory summary",
            summary
        });
    } catch (error) {
        next(error);
    }
};
