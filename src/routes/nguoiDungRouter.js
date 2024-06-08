import express from 'express'

import { dangKy, dangNhap, getUser, updateUser } from '../controllers/nguoiDungController.js';

const nguoiDungRouter = express.Router()

nguoiDungRouter.post("/dang-ky", dangKy)

nguoiDungRouter.post("/dang-nhap", dangNhap)

nguoiDungRouter.get("/get-user",
    (req, res, next) => {

        let { token } = req.headers;
        let err = checkToken(token)
        if (err == null) {
            next()
            return
        } else { }
        console.log(err)
        res.status(401).send(err.name)
    },
 getUser)

// update User
import multer, { diskStorage } from "multer";
import { checkToken } from '../config/jwt.js';
let uploadImg = multer({
    storage: diskStorage({
        destination: 'public/img/',
        filename: (req, file, callBack) => {
            let mSeceond = new Date().getTime()
            callBack(null, mSeceond + "_" + file.originalname)
        }

    })
})
nguoiDungRouter.put("/update-user",
    uploadImg.single("avata"),
    (req, res, next) => {

        let { token } = req.headers;
        let err = checkToken(token)
        if (err == null) {
            next()
            return
        } else { }
        console.log(err)
        res.status(401).send(err.name)
    },
    updateUser)







export default nguoiDungRouter