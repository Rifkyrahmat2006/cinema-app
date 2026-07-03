const success = (res, data = null, message = "Success", status = 200) => {

    return res.status(status).json({
        success: true,
        message,
        data
    });

};

const error = (res, message = "Internal Server Error", status = 500) => {

    return res.status(status).json({
        success: false,
        message
    });

};

module.exports = {
    success,
    error
};