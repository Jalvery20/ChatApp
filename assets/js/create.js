        let img;

        let addPhoto=(e)=>{
           let reader  = new FileReader();
            reader.onloadend = function(){
                img=`<img class="rounded-circle" src="${reader.result}" alt="">`;
                document.querySelector("label").innerHTML=img;
            }
            
            reader.readAsDataURL(e.target.files[0]);
            
            
            
            
        }

    document.getElementById("file").addEventListener("change",addPhoto)


    if(document.querySelector("#alert")){
        document.querySelector("#already").style.display="none";
        setTimeout(()=>{
            document.querySelector("#alert").remove()
            document.querySelector("#already").style.display="block";
        },3000)
        
    }
    
            
    