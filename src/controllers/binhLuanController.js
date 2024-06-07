import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from 'sequelize';
import { response } from "../config/response.js";
import bcrypt from "bcrypt"
import { createToken, decodeToken } from "../config/jwt.js";

const model = initModels(sequelize)



// get info Img bằng id
const getComments = async (req, res) => {
    let { idImg } = req.params

    let arrImg = await model.hinh_anh.findAll({ attributes: ['hinh_id'] })
    let index = arrImg.findIndex((item) => {
        return idImg == item.dataValues.hinh_id
    })
    if (index != -1) {
        let data = await model.binh_luan.findAll(

            {
                where: {
                    hinh_id: idImg
                },
                order:[ ["ngay_binh_luan","DESC"] ],
                include:["nguoi_dung"]
            }
        )
        response(res, data, "lấy bình luận thành công", 200)
    } else { response(res, "", "id ảnh không hợp lệ", 401) }
}

// lưu bình luận
const saveComment = async (req, res) => {
    let { hinh_id, noi_dung } = req.body
    let ngay_binh_luan = new Date();
    let { data } = decodeToken(req.headers.token)
    let { nguoi_dung_id } = data

    let infoComment = {
        nguoi_dung_id:nguoi_dung_id,
        hinh_id:hinh_id,
        noi_dung:noi_dung ,
        ngay_binh_luan:ngay_binh_luan
    }

    await model.binh_luan.create(newData);
    response(res, newData, "thành công", 200)
}


export {
    getComments,
    saveComment

}