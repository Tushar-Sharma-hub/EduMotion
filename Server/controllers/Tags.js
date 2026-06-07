const Tag=require("../models/Tag");

//Create tag fxn.
exports.createTag=async(req,res)=>{
    try{
        //fetch data
        const {name,description} = req.body;
        //Validate
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //Create entry
        const tagDetails=await Tag.create({
            name:name,
            description:description,
        });
        console.log(tagDetails);

        //return
        return res.status(200).json({
            success:true,
            message:"Tag Created Successfully",
        })
    }catch(error){
        return res.staus(500).json({
            success:false,
            message:error.message,
        })
    }
}

//Get all tags
exports.showAlltags=async(req,res)=>{
    try{
        const allTags=await Tag.find({},{name:true,description:true}); //find all tags but name and description should be there.
        return res.status(200).json({
            success:true,
            message:"All tags returned successfully",
            allTags,
        })
    }catch(error){
        return res.staus(500).json({
            success:false,
            message:error.message,
        })
    }
}