
if(document.querySelector("#wrong")){
    document.querySelector("#click").style.display="none";
    setTimeout(()=>{
        document.querySelector("#wrong").style.display="none";
        document.querySelector("#click").style.display="block";
    },3000)
}
