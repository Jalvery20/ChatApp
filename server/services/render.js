

let userDB=require("../models/userModel")

let chatDB=require("../models/chatModel")


exports.create=(req,res)=>{
    res.render("create")
}


exports.login=(req,res)=>{
    res.render("login")
}
exports.validate=(req,res)=>{
    if(!req.body){
        res.render("login",{msg:"Complete the fields"})
        return;
    }

    userDB.findOne({email:req.body.email,password:req.body.password})
    .then(user=>{
        if(!user){
            res.render("login",{msg:"If you are sign already.Probably your password is wrong"})
        }else  res.render("chat",{send:user})
        
    })
    .catch(err=>{
        res.status(500).send({message:err.message||"Error ocurred while retriving user info"})
    })

}

exports.chat=(req,res)=>{
    //Validate
    if(!req.body){
        res.status(400).send({message:"Content can not be empty"})
        return;
    }
    let user=new userDB({
        username:req.body.name,
        photo:req.body.photo,
        email:req.body.email,
        password:req.body.password
    })
    //Save user in the DataBase
    user
        .save(user)
        .then(data=>{
            res.render("chat",{send:user})
        })
        .catch(err=>{            
            res.render("create",{msg:"Some error ocurred.Probably the email is already taken!"})
        })
    
}

