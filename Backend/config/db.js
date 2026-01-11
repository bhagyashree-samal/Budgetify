const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
await mongoose.connect('mongodb+srv://samalbhagyashree75_db_user:vDd4zzRf0QPRXo7q@cluster0.w9m8scq.mongodb.net/?appName=Cluster0',{});
console.log("MongoDB connected");
    }catch(err){
console.error("Error connecting to mongoDB",err);
process.exit(1);
    }
};
module.exports= connectDB;