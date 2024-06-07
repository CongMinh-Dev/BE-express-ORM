import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { response } from "../config/response.js";


const model = initModels(sequelize)

// createLike
const createLike = async (req, res) => {
    let { user_id, res_id } = req.body
    // liên quan đến datetime => lấy từ server => BE
    let dateComment = new Date();

    let newData = {
        user_id: user_id,
        res_id: res_id,
        date_like: dateComment
    }
    await model.like_res.create(newData);
    response(res, newData, "like thành công", 200)
}


// unlike
const unlike = async (req, res) => {
    let { user_id, res_id } = req.body
    await model.like_res.destroy({
        where: {
            user_id: user_id
            ,
            res_id: res_id
            ,
        }
    });
    response(res, "", "unlike thành công", 200)
}


// arrLike
const arrLike = async (req, res) => {
    let { res_id } = req.params
    let data = await model.like_res.findAll({
        where: {
            res_id: res_id
        }
    })
    response(res, data, "lấy arrLike thành công", 200)
}


// createRate
const createRate = async (req, res) => {
    let { user_id, res_id, amount } = req.body
    // liên quan đến datetime => lấy từ server => BE
    let dateComment = new Date();
    let newData = {
        user_id: user_id,
        res_id: res_id,
        amount: amount,
        date_rate: dateComment
    }
    if (amount <= 5) {
        await model.rate_res.create(newData);
        response(res, newData, "rate thành công", 200)
    } else{response(res, "", "số lượng rate phải nhỏ hơn 5", 400) }
}


// arrRate
const arrRate = async (req, res) => {
    let { res_id } = req.params
    let data = await model.rate_res.findAll({
        where: {
            res_id: res_id
        }
    })
    response(res, data, "lấy arrRate thành công", 200)
}


// createOrder
const createOrder = async (req, res) => {
    let { user_id, food_id, amount,arr_sub_id } = req.body
    let newData = {
        user_id: user_id,
        food_id: food_id,
        amount:amount,
        arr_sub_id:arr_sub_id
    }
    await model.orders.create(newData);
    response(res, newData, "đặt món thành công", 200)
}



export {
    createLike,
    unlike,
    arrLike,
    createRate,
    arrRate,
    createOrder,
}