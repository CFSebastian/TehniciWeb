
/*
Colt Sebastian
fisier pentru produse scris injs

*/

//console.log(document.getElementById("produse"))

window.onload = function() {
    const selectElement = document.getElementById('tip-camera');
    for (let option of selectElement.options) {
        option.selected = true;
    }
    
}

/*window.addEventListener("load",function(){
    console.log(document.getElementById("produse").innerHTML)
})*/


window.addEventListener("load",function(){

    document.getElementById("inp-pret-min").onchange=function(){
        document.getElementById("infoRangeMin").innerHTML=`(${this.value})`
    }
    document.getElementById("inp-pret-max").onchange=function(){
        document.getElementById("infoRangeMax").innerHTML=`(${this.value})`
    }

    //document.getElementById("filtrare").addEventListener("click",function(){})
    document.getElementById("filtrare").onclick=function(){
        var inpNume=document.getElementById("inp-nume").value.toLowerCase().trim();

        var materiale=document.getElementById("materiale").value.toLowerCase().trim();
        var inpMat=materiale.split(",").map(item => item.trim());

        var is2=1;
        if (!(inpNume.indexOf("*")+1))
            is2=0;

        var radioCalorii=document.getElementsByName("gr_rad")
        let inpCalorii;
        for(let rad of radioCalorii){
            if(rad.checked) {
                inpCalorii=rad.value;
                break;
            }
        }
        let minCalorii, maxCalorii;
        if(inpCalorii!="toate"){
            vCal=inpCalorii.split(":")
            minCalorii=parseInt(vCal[0])
            maxCalorii=parseInt(vCal[1])
        }

        var asambalt=document.getElementById("i_che1").checked;
        var neasambalt=document.getElementById("i_che2").checked;
        
        var inpPretMin=parseInt(document.getElementById("inp-pret-min").value);
        var inpPretMax=parseInt(document.getElementById("inp-pret-max").value);

        var inpCateg= document.getElementById("inp-categorie").value.toLowerCase().trim()

        var produse=document.getElementsByClassName("produs");

        //var selOpt=Array.from(inpSelect.options).map(option => option.value.trim());

        var inpStil=document.getElementById("browse-stil").value.toLowerCase().trim();

        var inpSelect=document.getElementById("tip-camera");
        var optSelect=Array.from(inpSelect).map(option => option.value)

        for(let produs of produse){
            let valNume=produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim()
            let cond1
            if(is2) {
                vecN=inpNume.split("*")
                 cond1=(valNume.startsWith(vecN[0]) && valNume.includes(vecN[1]))
            } 
            else {
                cond1=valNume.startsWith(inpNume)
            }
            /*let cond1=matchPattern(nume, inputValue);*/
            //let cond1=valNume.startsWith(inpNume)

            let valMats=produs.getElementsByClassName("val-materiale")[0].innerHTML.toLowerCase().trim()
            
            let cond5=1
            for(let mat of materiale) {
                if(!(valMats.indexOf(mat)+1)) {
                    cond5=0;
                }
            }

            let valCalorii=parseInt(produs.getElementsByClassName("val-calorii")[0].innerHTML)

            let cond2=(inpCalorii=="toate" || (minCalorii<=valCalorii && valCalorii<maxCalorii));

            let valPret=parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML)

            let cond3=(valPret>inpPretMin && valPret<inpPretMax)

            /*let valAsam=parseFloat(produs.getElementsByClassName("val-asamblare")[0].innerHTML)
        
            let cond6=(valAsam==asambalt || valAsam==neasambalt)*/
            
            let valCategorie=produs.getElementsByClassName("val-categorie")[0].innerHTML.toLowerCase().trim()

            let cond4=(inpCateg==valCategorie || inpCateg=="toate")

            let valAsam = produs.getElementsByClassName("val-asamblare")[0].innerHTML.trim(); 
            let cond6;
           
            if (valAsam === 'DA' && asambalt && !neasambalt) {
                cond6=1;
            } 
           
            else {if (valAsam === 'NU' && !asambalt && neasambalt) {
                        cond6=1;
                    }
                
                    else {if (asambalt && neasambalt) {
                                cond6=1;
                            }
                        
                            else {
                                cond6=0;
                            }
                        }
                }

            let valStil=produs.getElementsByClassName("val-stil")[0].innerHTML.toLowerCase().trim();

            let cond7=(inpStil===valStil || inpStil==="toate");

            let valCamera = produs.getElementsByClassName("val-camera")[0].innerHTML.toLowerCase().trim();
            //let cond8 = optSelect.includes(valCamera);
            let cond8=0;
            for (let option of inpSelect.options) {
                if(option.selected === true && 
                    valCamera.toLowerCase().trim()===option.value.toLowerCase().trim()) {
                    cond8=1;
                    break;
                    }

            }
            

            if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8
                
            ){
                produs.style.display="block";
            }
            else {
                produs.style.display="none";
            }
            

        }

    }
    document.getElementById("resetare").onclick= function(){
        var confirmare = confirm("Sigur doriți să resetezi filtrele?");
        if (confirmare) { 
                
            document.getElementById("inp-nume").value="";
            document.getElementById("materiale").value="";
            document.getElementById("inp-pret-min").value=document.getElementById("inp-pret-min").min;
            document.getElementById("inp-pret-max").value=document.getElementById("inp-pret-max").max;
            document.getElementById("inp-categorie").value="toate";
            document.getElementById("i_rad4").checked=true;
            var produse=document.getElementsByClassName("produs");
            document.getElementById("infoRangeMin").innerHTML="(0)";
            document.getElementById("infoRangeMax").innerHTML="(3000)";
            for (let prod of produse){
                prod.style.display="block";
            }
            var rads=document.getElementsByName("gr_rad");
            for(let rad of rads){
                if(rad.checked) {
                    rad.checked;
                }
            }
            rads[3].checked;
        }
    }
    function sorteaza( semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse=Array.from(produse)
        v_produse.sort(function(a,b){
            let len_a=parseInt(a.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase().trim().length)
            let len_b=parseInt(b.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase().trim().length)
            if(len_a==len_b){
                let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML
                let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(len_a-len_b);
        })
        for(let prod of v_produse) {
            prod.parentNode.appendChild(prod)
        }
    }
    document.getElementById("sortCrescNume").onclick=function(){
        sorteaza(1)
    }

    document.getElementById("sortDescrescNume").onclick=function(){
        sorteaza(-1)
    }

    document.getElementById("b-suma").onclick=function(){
            var suma=0;
            var produse=document.getElementsByClassName("produs");
            for (let produs of produse){
                var stil=getComputedStyle(produs)
                if (stil.display!="none"){
                    suma+=parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML)
                }
            }
            if (!document.getElementById("par_suma")){
                let p= document.createElement("div")
                p.innerHTML=suma;
                p.id="par_suma";
                container=document.getElementById("produse")
                container.insertBefore(p,container.children[0])
                setTimeout(function(){
                    var pgf=document.getElementById("par_suma")
                    if(pgf)
                        pgf.remove()
                }, 2000)
            }
        }
    //function matchPattern(str, pattern) {
        //var regexPattern = pattern.replace(/\*/g, ".*");
        //var regex = new RegExp(regexPattern);
        //return regex.test(str);
    //}
    
   

})

/*const textMat=document.getElementById("materiale");
textMat.addEventListener('input',function(){
    const inpVal=textMat.value.trim();
    const invalid=document.querySelector('#materiale + #lab-mat');
    if(inpVal=='') 
    {
        textMat.classList.add('is-invalid');
        invalid.style.display ='block';
    } 
    else {
        textMat.classList.remove('is-invalid');
        invalid.style.display ='none';
    } 

})*/
