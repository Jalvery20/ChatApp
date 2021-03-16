let mongoose=require("mongoose");

let Userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    messages:[{
        type:mongoose.Schema.Types.ObjectId, ref: "MyChat_messages"
    }],
    photo:{
        type:Array
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }


})

let Usersdb=mongoose.model("MyChat_users",Userschema)

module.exports=Usersdb;