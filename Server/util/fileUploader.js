const cloudinary=require('cloudinary').v2

exports.uploadToCloudinary = async(file,folder,height,quality)=>{
    if(!file){
        throw new Error('No file provided to uploadToCloudinary')
    }
    if(!file.tempFilePath){
        throw new Error('Missing tempFilePath on uploaded file')
    }
    const options={folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto";
    try{
        return await cloudinary.uploader.upload(file.tempFilePath,options);
    }catch(err){
        console.error('Cloudinary uploader error:', err)
        throw err
    }
}