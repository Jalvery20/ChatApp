let mongoose=require("mongoose");

let chatSchema=new mongoose.Schema({
    userId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId, ref: "MyChat_users"
    },
    withWho:{
        required:true,
        type:mongoose.Schema.Types.ObjectId, ref: "MyChat_users"
    },
    message:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }
})


let Chatdb=mongoose.model("MyChat_messages",chatSchema)

module.exports=Chatdb;