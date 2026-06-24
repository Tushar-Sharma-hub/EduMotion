const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../util/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");

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
    const webhookSecret="qwertyuiop";

    const signature=req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex");

    if(signature==digest){
        console.log("Payment is Authorized.");
        const {courseId,userId} = req.body.payload.payment.entity.notes;
        try{
            //Fulfill action
            //Find the course and enroll student
            const enrolledCourse = await Course.findByIdAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true},
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found",
                });
            }
            console.log(enrolledCourse);

            //find the student and update courses
            const enrolledStudent = await User.findByIdAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true},
            );
            console.log(enrolledStudent);

            //send mail of confirmation

            const emailResponse= await mailSender(
                enrolledStudent.email,
                "Congratulations from EduMotion",
                "Congratulations, you are onboarded into new EduMotion Course."
            );
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature Verified and Course Added."
            })
        }catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    else{
        return res.status(200).json({
            success:false,
            message:"Invalid request.",
        });
    }
};