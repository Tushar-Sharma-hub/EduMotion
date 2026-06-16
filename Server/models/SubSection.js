//Subsection is video content with title, description and time duration. A section can have multiple sub-sections. It is a part of course content. A course can have multiple sections and a section can have multiple sub-sections.
const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    timeDuration:{
        type: String,
    },
    description:{
        type: String,
    },
    videoUrl:{
        type: String,
    },
});

module.exports = mongoose.model('SubSection', subSectionSchema);