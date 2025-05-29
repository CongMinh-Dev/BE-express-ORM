import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { response } from "../config/response.js";
import bcrypt from "bcrypt"
import { checkToken, checkTokenRef, createToken, createTokenL, createTokenRef, decodeToken } from "../config/jwt.js";

const model = initModels(sequelize)

// đăng ký
const dangKy = async (req, res) => {
    let { email, mat_khau, ho_ten, tuoi } = req.body

    let checkEmail = await model.nguoi_dung.findOne({
        where: { email: email }
    })

    if (checkEmail) {
        response(res, "", "Email đã tồn tại", 400)
        return
    }

    let newData = {
        email: email,
        mat_khau: bcrypt.hashSync(mat_khau, 10),
        ho_ten: ho_ten,
        tuoi: tuoi,
        anh_dai_dien: ""
    }
    await model.nguoi_dung.create(newData);
    response(res, "", "Đăng ký thành công", 200)
}

// đăng nhập
const dangNhap = async (req, res) => {
    let { email, mat_khau } = req.body;

    // check email trùng
    // email = email AND pass_word=password
    let checkEmail = await model.nguoi_dung.findOne({
        where: {
            email: email
        }
    })

    if (checkEmail) {
        if (bcrypt.compareSync(mat_khau, checkEmail.mat_khau)) {
            let token = createToken({ nguoi_dung_id: checkEmail.nguoi_dung_id });
            let refToken = createTokenRef({ nguoi_dung_id: checkEmail.nguoi_dung_id });
            model.nguoi_dung.update(
                {
                    ref_token: refToken
                },
                {
                    where: {
                        nguoi_dung_id: checkEmail.nguoi_dung_id
                    }
                }
            )
            console.log(checkEmail.nguoi_dung_id);
            response(res, token, "Đăng nhập thành công", 200);
        }
        else {
            response(res, "", "Mật khẩu không đúng", 400);
        }

    } else {

        response(res, "", "Email không đúng", 400);
    }

}

// get thông tin user
const getUser = async (req, res) => {
    let { token } = req.headers
    let { data } = decodeToken(token)
    let newData = await model.nguoi_dung.findByPk(data.nguoi_dung_id)
    response(res, newData, "thành công", 200)
}

//----------- update user
import cloudinary from "cloudinary"
import fs from "fs"
import compress_images from "compress-images"

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: 'dgqxl6kjl',
    api_key: '235221651969883',
    api_secret: 'biFICi47-VNwBm0O8GGoXEOXyaQ'
});
const updateUser = async (req, res) => {
    // Lấy file từ request
    const file = req.file;
    let { email, mat_khau, ho_ten, tuoi } = req.body
    let { token } = req.headers
    let { data } = decodeToken(token)

    let arrEmail = await model.nguoi_dung.findAll()
    let arrEmailFilter = arrEmail.filter((item) => {
        return item.dataValues.nguoi_dung_id != data.nguoi_dung_id
    }
    )

    let index = arrEmailFilter.findIndex((item) => {
        return item.dataValues.email == email
    })
    // xử lý email trùng
    if (index == -1) {

        let statistic = ""

        if (file) {
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

                function (err, completed, statisticClone) {
                    if (completed) {
                        // đã chuyển thành công thì mới xóa file gốc
                        fs.unlink(`public/img/${file.filename}`, (err) => {
                            err && console.log(err)
                        })
                        statistic = statisticClone
                        // Tải file lên Cloudinary
                        const newName = file.filename;
                        cloudinary.v2.uploader
                            .upload(statistic.path_out_new, {
                                asset_folder: 'node 41',
                                resource_type: 'image',
                                public_id: newName, //id trên clound
                                display_name: file.originalname // tên hiển thị trên cloud, k có là nó tự random
                            })
                            .then((result) => {
                                // up lên thành công thì xóa file low
                                fs.unlink(`public/imgLow/${file.filename}`, (err) => { })
                                let user = {
                                    email: email,
                                    mat_khau: bcrypt.hashSync(mat_khau, 10),
                                    ho_ten, ho_ten,
                                    tuoi: tuoi,
                                    anh_dai_dien: result.secure_url,

                                }
                                model.nguoi_dung.update(user, {
                                    where: { nguoi_dung_id: data.nguoi_dung_id }
                                })
                                response(res, "", "thành công", 200)

                            })
                    }
                }
            )
        } else {
            let user = {
                email: email,
                mat_khau: bcrypt.hashSync(mat_khau, 10),
                ho_ten, ho_ten,
                tuoi: tuoi,
            }
            model.nguoi_dung.update(user, {
                where: { nguoi_dung_id: data.nguoi_dung_id }
            })
            response(res, "", "thành công", 200)
        }

    } else {
        file && fs.unlink(`public/img/${file.filename}`, (err) => { })
        response(res, "", "email đã được đăng ký", 400)

    }

}


// đăng nhập
const taoToken = async (req, res) => {
    let token = createTokenL();
    response(res, token, "Đăng nhập thành công", 200);

}

export {
    dangKy,
    dangNhap,
    getUser,
    updateUser,
    taoToken
}