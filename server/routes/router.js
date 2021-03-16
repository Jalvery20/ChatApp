let express=require("express")
let  route=express.Router()

let services=require("../services/render")


route.get("/",services.login);

route.get("/create",services.create)

route.post("/login",services.validate)

route.post("/",services.chat)




module.exports=route;

