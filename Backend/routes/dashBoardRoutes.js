const express=require("express");
const { Protect}=require("../middleware/authMiddleware");
const {getDashboardData}=require("../controllers/dashBoardRoutes")

const router=express.Router();

router.get("/",Protect,getDashboardData);

module.exports=router;