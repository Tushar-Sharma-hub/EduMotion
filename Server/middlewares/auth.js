const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization") || req.header("authorization")
    const tokenFromHeader = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null
    const token = req.cookies?.token || req.body?.token || tokenFromHeader

    if (!token) {
      return res.status(401).json({ success: false, message: "Token not found" })
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decode
    } catch (error) {
      return res.status(401).json({ success: false, message: "token is invalid" })
    }

    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong during authorization.",
    })
  }
}

//isStudent
exports.isStudent = async(req,res,next) => {
    try{
        if(req.user.accountType!="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student"
            });
        }
        next();
    }catch(error){
        return res.status(400).json({success:false , message:"User role can't be verified , please try again."});
    }
}

//isInstructor
exports.isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType!="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor"
            });
        }
        next();
    }catch(error){
        return res.status(400).json({success:false , message:"User role can't be verified , please try again."});
    }
}

//isAdmin
exports.isAdmin = async(req,res,next) => {
    try{
        if(req.user.accountType!="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin"
            });
        }
        next();
    }catch(error){
        return res.status(400).json({success:false , message:"User role can't be verified , please try again."});
    }
}
