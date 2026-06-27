const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const {uploadToCloudinary}=require("../util/fileUploader");

//create Subsection
exports.createSubSection = async(req,res)=>{
    try{
        //data fetch from req body
        const {sectionId,title,timeDuration,description}=req.body;
        //video from req file
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration || !description || !video){
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
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });
        //push subsection objectid to section
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push:{
                    subSection:SubSectionDetails._id
                }
            },
            {new:true}
        ).populate("subSection");
        //return res
        return res.status(200).json({ success: true, message:"SubSection created",updatedSection});
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
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
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

    await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
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