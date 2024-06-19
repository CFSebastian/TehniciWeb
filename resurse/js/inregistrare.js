 window.onload= function(){
    var formular=document.getElementById("form_inreg");
    if(formular){
    formular.onsubmit= function(){
            let username = getElementById("inp-username").value = "";
            let nume = getElementById("inp-nume").value = "";
            let prenume = getElementById("inp-prenume").value = "";
            let parola = getElementById("parl").value = "";
            let rparola = getElementById("rparl").value = "";
            let email = getElementById("inp-email").value = "";
            if(username && nume && prenume && parola && rparola && email){
                alert("Nu ati completat toate casutele inportante");
                return false;
            }

            if(document.getElementById("parl").value!=document.getElementById("rparl").value){
                alert("Nu ati introdus acelasi sir pentru campurile \"parola\" si \"reintroducere parola\".");
                return false;
            }

            return true;
        }
    }
 }