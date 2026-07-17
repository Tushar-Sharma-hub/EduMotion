const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress")

const Course = require("../models/Course")
const User = require("../models/User")
const { uploadToCloudinary } = require("../util/fileUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../util/secToDuration")
// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body
    const id = req.user.id

    // Find the profile by id
    const userDetails = await User.findById(id)
    const profile = await Profile.findById(userDetails.additionalDetails)

    // const user = await User.findByIdAndUpdate(id, {
    //   firstName,
    //   lastName,
    // })
    // await user.save()

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender

    // Save the updated profile
    await profile.save()

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    console.log(id)
    const user = await User.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Associated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    })
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      )
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id })
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await CourseProgress.deleteMany({ userId: id })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" })
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

exports.updateDisplayPicture = async (req, res) => {
  try {
    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({ success: false, message: 'No displayPicture file provided' })
    }
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log('Cloudinary upload response:', image.secure_url)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    console.error('Error updating display picture:', error)
    return res.status(500).json({ success: false, message: error.message || 'Cloudinary error' })
  }
}

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      })
    }

    userDetails = userDetails.toObject()

    if (userDetails.courses) {
      // Filter out any null/deleted courses
      userDetails.courses = userDetails.courses.filter((course) => course !== null)

      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        let SubsectionLength = 0
        
        // Filter out null/deleted courseContent sections
        if (userDetails.courses[i].courseContent) {
          userDetails.courses[i].courseContent = userDetails.courses[i].courseContent.filter(
            (content) => content !== null
          )

          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            const section = userDetails.courses[i].courseContent[j]
            
            // Filter out null/deleted subSections
            if (section.subSection) {
              section.subSection = section.subSection.filter((sub) => sub !== null)

              totalDurationInSeconds += section.subSection.reduce(
                (acc, curr) => acc + parseInt(curr.timeDuration || 0),
                0
              )
              SubsectionLength += section.subSection.length
            }
          }
        }

        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )

        let courseProgressCount = await CourseProgress.findOne({
          courseId: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos?.length || 0

        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses || [],
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled?.length || 0
      const totalAmountGenerated = totalStudentsEnrolled * (course.price || 0)

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}