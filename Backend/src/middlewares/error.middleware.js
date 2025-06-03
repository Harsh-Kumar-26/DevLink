const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: err.success || false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: err.data || null,
    stack: err.stack || null
  });
};

export default errorHandler;
