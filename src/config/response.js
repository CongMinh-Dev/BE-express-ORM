
export const response = (res, data, message, code) => {
    res.json({
        statusCode: code,
        data: data,
        message: message,
        date: new Date()
    })
}