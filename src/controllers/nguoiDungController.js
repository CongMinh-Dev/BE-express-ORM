import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { response } from "../config/response.js";
import bcrypt from "bcrypt"
import { checkToken, checkTokenRef, createToken, createTokenRef, decodeToken } from "../config/jwt.js";

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
   let {token}= req.headers
   let {data}= decodeToken(token)
   let newData= await model.nguoi_dung.findByPk(data.nguoi_dung_id)
   response(res, newData, "thành công", 200)
}



export {
    dangKy,
    dangNhap,
    getUser
}