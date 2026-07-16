//This will send a url to reset password in mail.
const User = require("../models/User")
const mailSender = require("../util/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

//resetpasswordtoken - generate token , add token in user, make url using token , mail url 
exports.resetPasswordToken=async(req,res)=>{
    try{
        //get email from req body
        const email=req.body.email;
        //check user for the email(valdiation)
        const user=await User.findOne({email:email});
        if(!user){
            return res.json({message:"Your email is not registered with us."});
        }
        //generate token
        const token=crypto.randomUUID();
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email:email},
            {
                token:token,
                resetPasswordExpires: Date.now()+5*60*1000, //5min
            },
            {new:true} //this return updated document.
        );
        //create url
        const url=`http://localhost:3000/update-password/${token}`;
        //send mail containg url
        await mailSender(email,"Password Reset Link",`Password reset link: ${url} , Expires in 5 minutes.`);
        //return response
        return res.json({
            success:true,
            message:"Email sent successfully, please check email and change password."
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something fishy",
        })
    }
}

//resetpassword - it's the logic after user comes to reset link.
exports.resetPassword = async(req,res)=>{
    try{
        //data fetch
        const {password,confirmPassword,token}=req.body;
        //valdiation
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Confirm password is not same as password.",
            });
        }
        //get user details from db using token
        const userDetails=await User.findOne({token:token});
        //if no entry - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Inavlid reset token",
            });
        }
        //token time check
        if( userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Token expired, please regenrate token.",
            });
        }
        //hash new password
        const hashedPassword=await bcrypt.hash(password,10);
        //update new password
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
        //return response
        return res.status(200).json({
            success:true,
            message:"Your password has been reseted.",
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reseting the password."
        })
    }
}