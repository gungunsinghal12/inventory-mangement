
const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.code === 11000) {
        return res.status(400).json({
            message: "SKU already exists"
        });
    }

    if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).json({
            message: err.message
        });
    }

    res.status(500).json({
        message: "Internal Server Error"
    });
};

module.exports = errorHandler;
