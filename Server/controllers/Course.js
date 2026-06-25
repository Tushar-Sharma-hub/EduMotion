const Course=require("../models/Course");
const Category = require("../models/Category");
const User= require("../models/User");
const {uploadToCloudinary}=require("../util/fileUploader");

//createCourse handler
exports.createCourse=async(req,res)=>{
    try{
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,category}=req.body; //category is object id as we are passing it by objectId in course model.
        //get thumbnail
        const thumbnail=req.files.thumbnailImage;
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !category || !price || !thumbnail){
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

        //check given category valid or not
        const categoryDetails=await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                mesaage:"Category details not found.",
            })
        }

        //Upload image to cloudinary
        const thumbnailImage=await uploadToCloudinary(thumbnail,process.env.FOLDER_NAME)

        //create an for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            price,
            category:categoryDetails._id,
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

        //Update the category schema
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                courses: newCourse._id,
                },
            },
            { new: true }
        )

        //return response
        return res.status(200).json({
            success:true,
            message:"Course created successfully.",
        });
    }catch(error){
        return res.status(500).json({
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
        return res.status(200).json({
            success:true,
            message:"Courses Data fetched successfully.",
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to create course",
            error:error.message,
        });
    }
}

//getCourse details
exports.getCourseDetails = async(req,res) =>{
    try{
        //get id
        const {courseId} = req.body;
        //find course detail
        const courseDetails = await Course.find(
            {_id:courseId}
        )
        .populate(
            {
                path:"instructor",
                populate:{
                    path:"additionalDetails",
                },
            }
        )
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        })
        .exec();

        //Validate
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        //return response
        return res.status(200).json({
            success:true,
            message:"Course detailed fetched successfully.",
            data:courseDetails,
        })
    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.mesaage,
        })
    }
}