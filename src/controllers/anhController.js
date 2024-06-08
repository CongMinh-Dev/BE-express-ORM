import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from 'sequelize';
import { response } from "../config/response.js";
import bcrypt from "bcrypt"
import { createToken, decodeToken } from "../config/jwt.js";
import compress_images from "compress-images"

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

//----------- thêm một ảnh
import cloudinary from "cloudinary"
import fs from "fs"

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: 'dgqxl6kjl',
    api_key: '235221651969883',
    api_secret: 'biFICi47-VNwBm0O8GGoXEOXyaQ'
});
const addImg = async (req, res) => {
    // Lấy file từ request
    const file = req.file;
    let { mo_ta } = req.body

    const newName = file.filename;
    // giảm dung lượng file
    let input = `public/img/${file.filename}`
    let output = `public/imgLow/`
    compress_images(input, output,
        {
            compress_force: false, statistic: true, autoupdate: true
        }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "20"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },

        function (err, completed, statistic) {
            if (completed) {
                // đã chuyển thành công thì mới xóa file gốc
                fs.unlink(`public/img/${file.filename}`, (err) => {
                    err && console.log(err)
                })
                // Tải file lên Cloudinary
                cloudinary.v2.uploader
                    .upload(statistic.path_out_new, {
                        asset_folder: 'node 41',
                        resource_type: 'image',
                        public_id: newName, //id trên clound
                        display_name: file.originalname // tên hiển thị trên cloud, k có là nó tự random
                    })
                    .then((res) => {
                        // up lên thành công thì xóa file low
                        fs.unlink(`public/imgLow/${file.filename}`, (err) => { })
                        let { token } = req.headers
                        let { data } = decodeToken(token)
                        let img = {
                            ten_hinh: file.originalname,
                            duong_dan: res.secure_url,
                            mo_ta: mo_ta,
                            nguoi_dung_id: data.nguoi_dung_id
                        }
                        model.hinh_anh.create(img)

                    })
            }
        }
    )
    response(res, "", "thành công", 200)
}




export {
    getAllImg,
    findImg,
    getInfoImg,
    isSave,
    getCreatedImg,
    getSavedImg,
    deleteImg,
    addImg,
}