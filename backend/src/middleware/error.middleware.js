const errorHandler = (err, req, res, next) => {

    console.error("===== ERROR =====");
    console.error(err);
    console.error("=================");

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        statusCode,
        message: err.message || "Internal Server Error"
    });

};

export default errorHandler;