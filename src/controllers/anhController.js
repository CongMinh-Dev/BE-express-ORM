import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from 'sequelize';
import { response } from "../config/response.js";
import bcrypt from "bcrypt"
import { createToken, decodeToken } from "../config/jwt.js";
import compress_images from "compress-images"
import axios from "axios";

const model = initModels(sequelize)

// lấy danh sách ảnh
const getAllImg = async (req, res) => {
    let data = await model.hinh_anh.findAll({
        include: ["nguoi_dung"]
    })
    response(res, data, "lấy ảnh thành công", 200)

}

// tìm kiếm danh sách ảnh theo tên
const findImg = async (req, res) => {
    let { img_name } = req.headers

    let data = await model.hinh_anh.findAll({
        include: ["nguoi_dung"],
        where: {
            ten_hinh: {
                [Op.like]: `%${img_name}%`
            }
        }
    })
    response(res, data, "lấy ảnh thành công", 200)

}

// get info Img bằng id
const getInfoImg = async (req, res) => {
    let { id } = req.params

    let arrImg = await model.hinh_anh.findAll({ attributes: ['hinh_id'] })
    let index = arrImg.findIndex((item) => {
        return id == item.dataValues.hinh_id
    })
    if (index != -1) {
        let data = await model.hinh_anh.findByPk(
            id,
            {
                include: ["nguoi_dung"],
            }
        )
        response(res, data, "lấy ảnh thành công", 200)
    } else { response(res, "", "id không hợp lệ", 401) }


}

// is save
const isSave = async (req, res) => {
    let { id_img, token } = req.headers
    let { data } = decodeToken(token)
    let { nguoi_dung_id } = data
    // kiểm trả id ảnh có hợp lệ không
    let arrImg = await model.hinh_anh.findAll({ attributes: ['hinh_id'] })
    let index = arrImg.findIndex((item) => {
        return id_img == item.dataValues.hinh_id
    })
    if (index != -1) {
        // kiểm tra id ảnh có nằm trong bảng đã lưu không
        let arrSaveIdImg = await model.luu_anh.findAll({ attributes: ['hinh_id'] })
        let indexIdImg = arrSaveIdImg.findIndex((item) => {
            return id_img == item.dataValues.hinh_id
        })

        // kiểm tra id người dùng có nằm trong bảng đã lưu không
        let arrSaveIdUser = await model.luu_anh.findAll({ attributes: ['nguoi_dung_id'] })
        let indexIdUser = arrSaveIdUser.findIndex((item) => {
            return nguoi_dung_id == item.dataValues.nguoi_dung_id
        })

        // nếu id ảnh và id người dùng đều có trong bảng lưu thì true
        if (indexIdImg != -1 && indexIdUser != -1) {
            response(res, true, "đã lưu", 200)
        } else { response(res, false, "chưa lưu", 200) }

    } else { response(res, "", "id ảnh không hợp lệ", 401) }
}

// danh sách ảnh đã tạo
const getCreatedImg = async (req, res) => {
    let { token } = req.headers
    let { data } = decodeToken(token)

    let newData = await model.hinh_anh.findAll({
        where: {
            nguoi_dung_id: data.nguoi_dung_id
        }
    })
    response(res, newData, "thành công", 200)

}

// danh sách ảnh đã lưu
const getSavedImg = async (req, res) => {
    let { token } = req.headers
    let { data } = decodeToken(token)

    let newData = await model.luu_anh.findAll({
        where: {
            nguoi_dung_id: data.nguoi_dung_id
        },
        include: ["hinh"]
    })
    response(res, newData, "thành công", 200)

}

// xóa ảnh đã tạo theo id
const deleteImg = async (req, res) => {
    let { imgId } = req.params
    let { token } = req.headers
    let { data } = decodeToken(token)

    let isDelete = await model.hinh_anh.destroy({
        where: {
            hinh_id: imgId,
            nguoi_dung_id: data.nguoi_dung_id
        },

    })
    if (isDelete == 0) {
        response(res, "", "Not found", 400)
        return
    }
    response(res, "", "xóa thành công", 200)

}

// thêm một ảnh
import cloudinary from "cloudinary"
// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: 'dgqxl6kjl',
    api_key: '235221651969883',
    api_secret: 'biFICi47-VNwBm0O8GGoXEOXyaQ'
});
const addImg = async (req, res) => {
    // Lấy file từ request
    const file = req.file;
    // Tải file lên Cloudinary
    const result = await cloudinary.v2.uploader
    .upload(file.path, {
      asset_folder: 'node 41',
      resource_type: 'image'})
    // xin ra url   
    console.log(result.secure_url)


    // axios({
    //     url: "https://api.cloudinary.com/v1_1/dgqxl6kjl/image/upload",
    //     method: "POST",
    //     data: formData
    // })
    //     .then((res) => {
    //         console.log("thanh cong");
    //     })
    //     .catch((err) => {
    //         console.log("that bai");
    //     });

    response(res, "", "thành công", 200)


    // compress_images(INPUT_path_to_your_images, OUTPUT_path,
    //     {
    //         compress_force: false, statistic: true, autoupdate: true
    //     }, false,
    //     { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    //     { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    //     { svg: { engine: "svgo", command: "--multipass" } },
    //     { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } })


}


export {
    getAllImg,
    findImg,
    getInfoImg,
    isSave,
    getCreatedImg,
    getSavedImg,
    deleteImg,
    addImg
}