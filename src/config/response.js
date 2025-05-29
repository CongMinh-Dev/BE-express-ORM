
export const response = (res, data, message, code) => {
    res.status(code).json({
        statusCode: code,
        data: data,
        message: message,
        date: new Date()
    })
}