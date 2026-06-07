const Course=require("../models/Course");
const Tag = require("../models/Tag");
const User= require("../models/User");
const {uploadImageToCloudinary}=require("../util/imageUploader");

//createCourse handler
exports.createCourse=async(req,res)=>{
    try{
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body; //here tag is object id as we are passing it by objectId in course model.
        //get thumbnail
        const thumbnail=req.files.thumbnailImage;
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !tag || !price || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        //check for instructor
        const userId = req.user.id; //as we hae assigned decoded payload of jwt in middleware auth.
        const instructorDetails=await User.findById(userId);
        console.log("Instructor Details:",instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                mesaage:"Instructor details not found.",
            })
        }

        //check given tag valid or not
        const tagDetails=await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                mesaage:"Tag details not found.",
            })
        }

        //Upload image to cloudinary
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        //create an for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        //add the new course to user schema of instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        )

        //Update the tag ka schema


        //return response
        return res.staus(200).json({
            success:true,
            message:"Course created successfully.",
        });
    }catch(error){
        return res.staus(500).json({
            success:false,
            message:"Failed to create course",
            error:error.message,
        });
    }
}

//getAllCourses handler
exports.showAllCourses=async(req,res)=>{
    try{
        const allCourses=await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate("instructor").exec();
        return res.staus(200).json({
            success:true,
            message:"Courses Data fetched successfully.",
        });
    }catch(error){
        return res.staus(500).json({
            success:false,
            message:"Failed to create course",
            error:error.message,
        });
    }
}