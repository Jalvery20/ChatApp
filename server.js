let express=require("express")
let dotenv=require("dotenv")
let app=express()
let path=require("path")
let http=require("http").createServer(app)
let bodyparser=require("body-parser")


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))


dotenv.config({path:"config.env"})
let PORT=process.env.PORT||8080;


app.use("/css",express.static(path.resolve(__dirname,"./assets/css")))
app.use("/js",express.static(path.resolve(__dirname,"./assets/js")))

app.use("/privChat/css",express.static(path.resolve(__dirname,"./assets/css")))
app.use("/privChat/js",express.static(path.resolve(__dirname,"./assets/js")))


//set view engine
app.set("view engine","ejs")




//ConnectDB
let MongoDB=require("./server/database/connection")
MongoDB()

//load routers
app.use("/",require("./server/routes/router"))




let chatDB=require("./server/models/chatModel")
let userDB=require("./server/models/userModel")
//Socket
let io=require("socket.io")(http)
let users=[];



io.on("connection",socket=>{
    socket.emit("id",socket.id)
    socket.on("botMessage",(data)=>{
        users.push({id:data.id,name:data.name})
        socket.broadcast.emit("sendBotMsg",data)
        socket.broadcast.emit("newUser",{id:socket.id,msg:data})
    })
    socket.on("activeUsers",msg=>{
        
        socket.to(msg.id).emit("othersUsers",{name:msg.name,id:msg.localId,databaseId:msg.databaseId})
    })
    socket.broadcast.emit("botMessage","Hello")
    socket.on("privateMongo",id=>{
        chatDB.find({$or:[{withWho:id.other,userId:id.user},{withWho:id.user,userId:id.other}]})
            .then(messages=>{
                for (let i = 0; i < messages.length; i++) {
                   let matters={
                       message:messages[i].message,
                       times:messages[i].time,
                       withWho:messages[i].withWho
                   } 
                   socket.emit("oldMsgs",matters)
                }
            })
            .catch(err=>{
                console.log(err)
        })
    });
   
    
    socket.on("sendMessage",msg=>{
        socket.broadcast.emit("sendToAll",msg)
    })
    socket.on("sendPrivMsg",msg=>{
        
        io.to(msg.id).emit("sendToOne",msg)
    })
    socket.on("privId",msg=>{
        let newMsg=new chatDB({
            userId:msg.privId,
            withWho:msg.dataid,
            message:msg.message,
            time:msg.time
        })
        newMsg
            .save(newMsg)
            .then(d=>{
            })
            .catch(err=>{
                console.log(err)
            })

   })
    
    socket.on("disconnect",()=>{
     let userGone=users.filter(user=>user.id==socket.id)
     let updateUsers=users.filter(user=>user.id!==socket.id)
     users=updateUsers;
     
        io.emit("Disconnect",userGone)
    })
   
})



http.listen(5000,()=>console.log(`Server is running on http://localhost:${PORT}`))