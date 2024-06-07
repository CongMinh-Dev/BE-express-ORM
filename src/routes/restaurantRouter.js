// Nơi định nghĩa API
import express from 'express'

// import { checkToken, verifyToken } from '../config/jwt.js';
import { arrLike, arrRate, createLike, createOrder, createRate, unlike } from '../controllers/restaurantController.js';

const restaurantRouter = express.Router()

// API create like
restaurantRouter.post("/like", createLike)

// api unlike
restaurantRouter.delete("/unlike", unlike)

// api lấy danh sách like
restaurantRouter.get("/arrlike/:res_id", arrLike)


// API create rate
restaurantRouter.post("/rate", createRate)

// api lấy danh sách rate
restaurantRouter.get("/arr-rate/:res_id", arrRate)


// API create order
restaurantRouter.post("/order", createOrder)





export default restaurantRouter