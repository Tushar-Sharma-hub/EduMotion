const mongoose=require('mongoose');
require('dotenv').config();
const { seedData } = require("./seeder");

exports.connectDB=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(async ()=>{
        console.log('Connected to MongoDB');
        await seedData();
    })
    .catch((err)=>{
        console.log('Error connecting to MongoDB',err);
        process.exit(1);
    });
}