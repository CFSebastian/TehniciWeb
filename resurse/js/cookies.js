
var time1=1000*60*60*12;
var time2=1000*5;
//setCookie("a",10, 1000)
function setCookie(nume, val, timpExpirare){//timpExpirare in milisecunde
    d=new Date();
    d.setTime(d.getTime()+timpExpirare)
    document.cookie=`${nume}=${val}; expires=${d.toUTCString()}`;
}

function getCookie(nume){
    vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"]
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume+"="))
            return param.split("=")[1]
    }
    return null;
}

function deleteCookie(nume){
    console.log(`${nume}; expires=${(new Date()).toUTCString()}`)
    document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`;
}
function deleteAllCookies(){
    vectorParametri=document.cookie.split(";")
    for(let param of vectorParametri){
        deleteCookie(param.split("=")[0])
    }
}

window.addEventListener("load", function(){
    if (getCookie("acceptat_banner")){
        document.getElementById("banner").style.display="none";
    }

    this.document.getElementById("ok_cookies").onclick=function(){
        setCookie("acceptat_banner",true,time2);
        document.getElementById("banner").style.display="none"
    }

    if (!getCookie("acceptat_banner")) {
        banner.style.display = 'block';
        banner.style.animation = 'slideUp 3s forwards';
    }
})


// Wait for the DOM to be fully loaded

/*document.addEventListener('DOMContentLoaded', function() {
    // Select all links with the class 'linkprod'
    const links = document.querySelectorAll('.linkprod');

    // Iterate over each link and add an event listener
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevent the default action of the link (navigation)
            //event.preventDefault();

            // Find the nearest .val-nume element within the clicked link
            const valNumeElement = this.querySelector('.val-nume');

            // Check if the element exists and perform any action you need
            if (valNumeElement) {
                //console.log('val-nume content:', valNumeElement.textContent);
                //For demonstration purposes, let's alert the text content
                //alert('Nume: ' + valNumeElement.textContent);
                if(getCookie("acceptat_banner")) {
                    setCookie("Ultimul_Produs",valNumeElement.textContent,time1 )
                    
                }
            } else {
                console.log('val-nume element not found');
            }

            // Optionally, navigate to the link's href after processing
            // window.location.href = this.href;
        });
    });
});*/
document.addEventListener('DOMContentLoaded', function() {
    const links = document.getElementsByClassName('linkprod');

    for (let link of links) {
        link.addEventListener('click', function(event) {
            // Prevent the default action of the link (navigation)
            // event.preventDefault();

            const valNumeElements = this.getElementsByClassName('val-nume');

            if (valNumeElements.length > 0) {
                const valNumeElement = valNumeElements[0];
                if (getCookie("acceptat_banner")) {
                    setCookie("Ultimul_Produs", valNumeElement.textContent, time2);
                }
            } else {
                console.log('val-nume element not found');
            }

            // Optionally, navigate to the link's href after processing
            // window.location.href = this.href;
        });
    }
});

window.onload = function() {
    if(getCookie("acceptat_banner"))
    {
        document.getElementById("infoCookie").innerHTML=`<p >Activat <br> Ultimul Produs selectat: ${getCookie("Ultimul_Produs") 
            ? getCookie("Ultimul_Produs") : "Nu este"}
        </p>`;
    }
    else
    {
        document.getElementById("infoCookie").innerHTML=`Dezactivat`;
     }
}