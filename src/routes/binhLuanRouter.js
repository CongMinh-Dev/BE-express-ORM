import express from 'express'
import { findImg, getAllImg, getInfoImg } from '../controllers/anhController.js'
import { checkToken } from '../config/jwt.js';
import { getComments, saveComment } from '../controllers/binhLuanController.js';



const binhLuanRouter = express.Router()


binhLuanRouter.get("/get-comments/:idImg",
    (req, res, next) => {

        let { token } = req.headers;
        let err = checkToken(token)
        if (err == null) {
            next()
            return
        }

        res.status(401).send(err.name)
        console.log(err.name)
    },
    getComments)

binhLuanRouter.post("/save-comment",
    (req, res, next) => {

        let { token } = req.headers;
        let err = checkToken(token)
        if (err == null) {
            next()
            return
        }

        res.status(401).send(err.name)
        console.log(err.name)
    },
    saveComment)









export default binhLuanRouter