const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

// CREATE a new section
exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body; //courseId lenge jisse hum course model mai section ko insert kr paay.

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({ //section and subsection
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// UPDATE a section
exports.updateSection = async (req, res) => {
	try {
		//data input
		const {sectionName,sectionId}=req.body;
		//data validation
		if(!sectionName || !sectionId){
			return res.status(400).json({
				success: false,
				message: "Missing properties",
			});
		}
		//update data
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{sectionName},
			{new:true}
		);
		//return res
		res.status(200).json({
			success: true,
			message: "Section updated successfully"
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {
		//get ID- we are sending id in params
		const {sectionId,courseId}=req.body;
		if(!sectionId || !courseId){
			return res.status(400).json({
				success: false,
				message: "Missing properties",
			});
		}
		//use findbyid and delete
		await Section.findByIdAndDelete(sectionId);
		//Do we need to delete it from course also??Yes
		await Course.findByIdAndUpdate(
			courseId,
			{
				$pull: {
					courseContent: sectionId,
				},
			},
			{
				returnDocument: "after",
			}
		);
		//return response
		res.status(200).json({
			success: true,
			message: "Section deleted successfully"
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   