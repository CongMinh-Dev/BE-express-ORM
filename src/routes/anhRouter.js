import express from 'express'
import { addImg, deleteImg, findImg, getAllImg, getCreatedImg, getInfoImg, getSavedImg, isSave } from '../controllers/anhController.js'
import { checkToken } from '../config/jwt.js';



const anhRouter = express.Router()


anhRouter.get("/get-all-img", getAllImg)


anhRouter.get("/find-img", findImg)


anhRouter.get("/info-img/:id", getInfoImg)


anhRouter.get("/is-save",
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
    isSave)

anhRouter.get("/get-created-img",
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
    getCreatedImg)

anhRouter.get("/get-saved-img",
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
    getSavedImg)

anhRouter.delete("/delete-img/:imgId",
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
    deleteImg)

// thêm ảnh
import multer, { diskStorage } from "multer";
let uploadImg = multer({
    storage: diskStorage({
        destination: 'public/img/',
        filename: (req, file, callBack) => {
            let mSeceond = new Date().getTime()
            callBack(null, mSeceond + "_" + file.originalname)
        }

    })
})
anhRouter.post("/add-img",
    uploadImg.single("file"),
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
    addImg)






export default anhRouter