
let tema=localStorage.getItem("tema");
if(tema)
    document.body.classList.add("dark");
    
window.addEventListener("DOMContentLoaded", function(){
document.getElementById("schimba_tema").onclick= function(){
    if(document.body.classList.contains("dark")){
        document.body.classList.remove("dark")
        localStorage.removeItem("tema");
        document.getElementById("schimba_tema"),innerHTML=`<i class="fa-solid fa-sun" ></i>`
    }
    else{
        document.body.classList.add("dark")
        localStorage.setItem("tema","dark");
        document.getElementById("schimba_tema"),innerHTML=`<i class="fa-solid fa-moon"></i>`
    }
}
});



