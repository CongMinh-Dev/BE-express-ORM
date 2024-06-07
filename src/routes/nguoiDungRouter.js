import express from 'express'

import { dangKy, dangNhap, getUser  } from '../controllers/nguoiDungController.js';

const nguoiDungRouter = express.Router()

nguoiDungRouter.post("/dang-ky", dangKy)

nguoiDungRouter.post("/dang-nhap", dangNhap)

nguoiDungRouter.get("/get-user", getUser)







export default nguoiDungRouter