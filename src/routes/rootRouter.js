import express from 'express'

import nguoiDungRouter from './nguoiDungRouter.js';
import anhRouter from './anhRouter.js';
import binhLuanRouter from './binhLuanRouter.js';

const rootRouter = express.Router()




rootRouter.use("/",nguoiDungRouter)
rootRouter.use("/",anhRouter)
rootRouter.use("/",binhLuanRouter)


export default rootRouter;


