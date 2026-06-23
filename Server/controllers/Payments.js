const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../util/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the razorpay order
exports.capturePayment = async(req,res) => {
    //get courseId and userId
    const {course_id}= req.body ;
    const userId = req.user.id ; 
    //validation
    //valid courseId
    if(!course_id){
        return res.json({
            success:false,
            message:"Please provide valid course id.",
        });
    }
    //valid courseDetail
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"Could not find course.",
            });
        }
        //user already pay for the same course
        const uid=new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:"Already enrolled.",
            });
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
    //order create
    const amount=course.price;
    const currency="INR";

    const options={
        amount: amount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }
    };

    try{
        //initiate payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            succes:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Could not initiate order",
        });
    }
}

//verify signature of razorpay
exports.verfiySignature = async(req,res)=>{
    
};