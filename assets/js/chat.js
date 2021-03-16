let socket=io()
let message=document.querySelector("form").querySelector("input")
let send=document.querySelector("form").querySelector("button");
let chatBox=document.querySelector(".chat-content")
let displayMsg=document.querySelector(".message")
let user=document.querySelector("#user").textContent;
let activeContainer=document.querySelector("#actives")
let collbtn=document.querySelector("#collbtn")
let userId;
let groupbtn=`<button id="back" class="col-6 btn btn btn-dark text-warning text-shadow">Back to Group</button>`;
let databaseUserId=document.querySelector("span").textContent;

socket.on("id",id=>{
   userId=id;
    socket.emit("botMessage",data={
        name:user,
        id:userId,
        databaseId:databaseUserId
    })
})

let activeUsers=activeContainer.querySelectorAll("a")
let activeUser;
let privUserId;
let activeA;


collbtn.addEventListener("click",()=>{
    activeUsers=activeContainer.querySelectorAll("a")
    
    for (let i = 0; i < activeUsers.length; i++) {
            activeUsers[i].addEventListener("click",(e)=>{
                e.stopPropagation()
                if(activeA==activeUsers[i]) {
                    collbtn.click()
                    return;
                }
                activeA=activeUsers[i];
                collbtn.click()
                let name=activeUsers[i].querySelector("span").textContent;
                let otherUser=activeUsers[i].querySelector("pre").textContent;
                privUserId=activeUsers[i].querySelectorAll("pre")[1].textContent;
                document.querySelector("#textWho").innerHTML=`Chatting with <span>${name}</span>`;
               socket.emit("privateMongo",{user:databaseUserId,other:otherUser})
                document.querySelector("#btnCont").innerHTML=`<button id="collbtn" data-toggle="collapse" data-target="#actives" class="col-6 btn btn-dark text-warning text-shadow">Active Users</button>${groupbtn}`;
                activeUser=activeUsers[i].textContent
                displayMsg.innerHTML="";

                document.querySelector("#back").addEventListener("click",()=>{
                    privUserId=undefined;
                    document.querySelector("#textWho").innerHTML="Everybody`s Group";
                    displayMsg.innerHTML="";
                    document.querySelector("#back").remove()
                    activeA=undefined;


                })
                
            })
        
    }
})

socket.on("oldMsgs",messages=>{
        let msg=messages;
        if(msg.withWho==databaseUserId) {
            msg.user=user;
            display(msg,"you-message")
        }else{
            msg.user=document.querySelector("#textWho").querySelector("span").textContent
            display(msg,"other-message")
        } 
})

socket.on("newUser",data=>{
    if(activeContainer.querySelector("p")) activeContainer.innerHTML="";
    let newUser=`<a href="#"><i class="bi bi-person-circle"></i>  <span>${data.msg.name}</span><pre>${data.msg.databaseId}</pre><pre>${data.id}</pre><br></a>`
    activeContainer.innerHTML+=newUser;
    
    socket.emit("activeUsers",{name:user,id:data.id,localId:userId,databaseId:databaseUserId})
    
})   
socket.on("othersUsers",data=>{
    if(activeContainer.querySelector("p")) activeContainer.innerHTML="";
    let newUser=`<a href="#"><i class="bi bi-person-circle"></i>  <span>${data.name}</span><pre>${data.databaseId}</pre><pre>${data.id}</pre><br></a>`
    activeContainer.innerHTML+=newUser;
    
})
    



message.focus()

send.addEventListener("click",(e)=>{
    e.preventDefault()
    if(message.value){
        sendMsg(message.value)
    }
    message.value="";
    document.querySelector("form").querySelector("input").focus()
    chatBox.scrollTop=chatBox.scrollHeight;
})
let sendMsg=message=>{
    let msg={
        user:user,
        message:message,
        dataid:databaseUserId,
        userId:userId,
        time:new Date().toLocaleTimeString()
    }
    display(msg,"you-message")
    if(!privUserId)socket.emit("sendMessage",msg)
    else{
        msg.id=privUserId;
        socket.emit("sendPrivMsg",msg)
    } 
}
socket.on("sendToAll",msg=>{
    if(!privUserId) display(msg,"other-message")
    
    chatBox.scrollTop=chatBox.scrollHeight;
})
socket.on("sendToOne",msg=>{
    msg.privId=databaseUserId;
    socket.emit("privId",msg)
    if(!privUserId ||msg.user!==document.querySelector("#textWho").querySelector("span").textContent) {
        msg.type="private";
        display(msg,"other-message")
    }else{
        
        display(msg,"other-message")
    }
    chatBox.scrollTop=chatBox.scrollHeight;
})
//New Active

socket.on("sendBotMsg",msg=>{
   if(!privUserId) display(msg,"bot-message")

    chatBox.scrollTop=chatBox.scrollHeight;
})
socket.on("Disconnect",(data)=>{
   let actives=activeContainer.querySelectorAll("a")
   
  for (let i = 0; i < actives.length; i++) {
    if(actives.length==1){
        let p=`<p>😢There is no active users!</p>`
        
        activeContainer.innerHTML=p;
    }else if(actives[i].innerHTML.toString().indexOf(`${data[0].id}`)!==-1){
        actives[i].remove()
        
    }
    
      
  }
    
    
        

    let userGone=data;
    userGone.type="userGone"
   if(!privUserId) display(userGone,"bot-message")
})

let display=(msg,type)=>{
    let msgDiv=document.createElement("div")
    let className=!msg.type ? type : "notif";
    msgDiv.classList.add(className,"message-row")
    let times
    if(!msg.times) {
         times= new Date().toLocaleTimeString()
    }else{
         times=msg.times;
    }
    if(type!=="bot-message"){
            let innerText=`
            <div class="message-title">
            🦁<span>${msg.user}</span>
            </div>
            <div class="message-text cos-shadow text-shadow">
                ${msg.message}
            </div>
            <div class="message-time">
                ${times}
            </div>
            `;
            if(msg.type){
                msgDiv.innerHTML=`<div id="privNot" class="message-text border bg-success cos-shadow text-shadow text-white">
                You got a private from <span>${msg.user}</span>
                </div>`
                displayMsg.appendChild(msgDiv)
                msgDiv.addEventListener("click",()=>{
                   for (let i = 0; i < activeContainer.querySelectorAll("a").length; i++) {
                      if(msgDiv.querySelector("span").textContent==activeContainer.querySelectorAll("a")[i].querySelector("span").textContent) {
                            collbtn.click() 
                        activeContainer.querySelectorAll("a")[i].click() 
                        setTimeout(()=>{
                            collbtn.click()
                        },5)
                        }
                    } 
                })
            }else{
                msgDiv.innerHTML=innerText;
                displayMsg.appendChild(msgDiv)
            }
    }else{
        if(msg.type){
            let innerText=`
    <div class="message-text border cos-shadow text-shadow text-white bg-secondary">
        ${msg[0].name} has left
    </div>
    
    `;
    msgDiv.innerHTML=innerText;
    displayMsg.appendChild(msgDiv)
        }else{
        let innerText=`
    <div class="message-text border cos-shadow text-shadow text-white bg-secondary">
        ${msg.name} has joined
    </div>
    
    `;
    msgDiv.innerHTML=innerText;
    displayMsg.appendChild(msgDiv)
        }
    }
}

