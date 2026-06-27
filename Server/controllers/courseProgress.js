const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");

exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;
    const userId = req.user?.id;

    if (!courseId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "courseId and subSectionId are required.",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user.",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseId,
        userId,
        completedVideos: [subSectionId],
      });
    } else {
      const hasSubSection = courseProgress.completedVideos.some(
        (id) => id.toString() === subSectionId.toString()
      );
      if (!hasSubSection) {
        courseProgress.completedVideos.push(subSectionId);
        await courseProgress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Course progress updated successfully.",
      courseProgress,
    });
  } catch (error) {
    console.error("Error updating course progress:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update course progress.",
      error: error.message,
    });
  }
};
