let mongoose=require("mongoose");

let connectDB=async()=>{
    try{
        //Mongo connection string
        let connection=await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCreateIndex:true
        })

        console.log(`MongoDB connected:${connection.connection.host}`)
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports=connectDB;