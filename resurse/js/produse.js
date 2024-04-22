/*
Colt Sebastian
fisier pentru produse scris injs

*/

//console.log(document.getElementById("produse"))
window.addEventListener("load",function(){
    console.log(document.getElementById("produse").innerHTML)
})

window.addEventListener("load",function(){

    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`
    }


    //document.getElementById("filtrare").addEventListener("click",function(){})
    document.getElementById("filtrare").onclick=function(){
        var inpNume=document.getElementById("inp-nume").value.toLowerCase().trim();

        var radioCalorii=document.getElementsByClassName("gr_rad")
        let inpCalorii
        for(let rad of radioCalorii){
            if(rad.checked) {
                inpCalorii=cad.value;
                break;
            }
        }
        let minCalorii, maxCalorii;
        if(inpCalorii="toate"){
            vCal=inpCalorii.split(":")
            minCalorii=parseInt(vCal[0])
            maxCalorii=parseInt(vCal[1])
            
        }

        var produse=document.getElementsByClassName("produs");
        for(let produs of produse){
            let valNume=produs.getElementsByClassName("val-nume")[0].innerHTML.toLocaleLowerCase().trim()
            let cond1=valNume.startsWith(inpNume)
            let valCalorii=parseInt(produs.getElementsByClassName("val-calorii")[0].innerHTML)
            let cond2=(inpCalorii=="toate" || (minCalorii<=valCalorii && valCalorii<maxCalorii));
            if(cond1 && cond2){
                produs.style.display="block";
            }
            else {
                produs.style.display="none";
            }

        }

    }
})