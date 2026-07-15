const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const Course = require("../models/Course")
const { uploadToCloudinary } = require("../util/fileUploader")

//create Subsection
exports.createSubSection = async(req,res)=>{
    try{
        //data fetch from req body
        const {sectionId,title,description} = req.body;
        //video from req file
        const video = req.files?.video || req.files?.videoFile;
        //validation
        if(!sectionId || !title || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        //upload video to cloudinary
        const uploadDetails = await uploadToCloudinary(video,process.env.FOLDER_NAME)
        //create subsection
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });
        //push subsection objectid to section
        const updatedSection = await Section.findByIdAndUpdate(
          { _id: sectionId },
          {
            $push: {
              subSection: SubSectionDetails._id,
            },
          },
          { new: true }
        ).populate("subSection")

        const updatedCourse = await Course.findOne({
          courseContent: sectionId,
        })
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()

        //return res
        return res.status(200).json({
          success: true,
          message: "SubSection created",
          data: updatedCourse,
        })
    }
    catch(error){
        console.error("Error creating new sub-section:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
        });
    }
};

//update SubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    const video = req.files?.video || req.files?.videoFile
    if (video !== undefined) {
      const uploadDetails = await uploadToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated course and return it
    const updatedCourse = await Course.findOne({
      courseContent: sectionId,
    })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    console.log("updated course after subsection edit", updatedCourse)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}

//delete subsection
exports.deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.body

    if (!sectionId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "sectionId and subSectionId are required",
      })
    }

    const subSection = await SubSection.findById(subSectionId)
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    await SubSection.findByIdAndDelete(subSectionId)

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    ).populate("subSection")

    const updatedCourse = await Course.findOne({
      courseContent: sectionId,
    })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error("Error deleting sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    console.log(userDetails)
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}