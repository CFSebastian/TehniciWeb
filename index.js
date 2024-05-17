const express = require("express");//include biblioteca express
const fs= require('fs');//include biblioteca fs sistemul de fisiere poate sa fac chesti primeasca citeasca etc
const path=require('path');// se uita la cai
const sharp=require('sharp');
const sass=require('sass');
//const { Client } = require("pg");
const { request } = require("http");
const ejs=require('ejs');
const AccesBD= require("./module_proprii/accesbd.js");

const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js")
const session=require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");
const utilizator = require("./module_proprii/utilizator.js");

const Client = require("pg").Client;

var client= new Client({database:"cti_2024",
        user:"sebi1",
        password:"sebi1",
        host:"localhost",
        port:5432});
client.connect();


client.query("select * from unnest(enum_range(null::categ_prajituri))", function(err,rez){
    console.log(rez);
})

obGlobal = {
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname,"/resurse/scss"),
    folderCss: path.join(__dirname,"/resurse/css"),
    folderBackup: path.join(__dirname,"backup"),
    
}

vect_foldere = ["temp", "temp1","backup","poze_uploadate"];
for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder)
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
    }
}

app= express();//apeleaza o functie din express , iar app va astepta o valoare

app.use(session({ // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
  }));

console.log("Folder proiect", __dirname);//Folderul aplicatiei
console.log("Cale fisier", __filename);//calea fisier
console.log("Director de lucru", process.cwd());//Curent working directory , folderul de unde rulam aplicatia

app.set("view engine","ejs");//motorul de temp

app.use("/resurse", express.static(__dirname+"/resurse"));//fac un alias
app.use("/poze_uploadate", express.static(__dirname+"/poze_uploadate"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

//app.get("/",function(req,res){
//    res.sendFile(__dirname+"/index.html")
//})

app.get(["/", "/home", "/index"], function (req, res) {
    res.render("pagini/index", {ip: req.ip, imagini:obGlobal.obImagini.imagini});
})

app.get("/cerere", function(req,res){
    res.send("<b>Hello</b><span style='color:red'> world !</span>");
});

app.get("/data", function(req,res,next){
    res.write("Data: ");
    next();
});

app.get("/data", function(req,res){
    res.write(""+new Date());
    res.end();
});


app.get("/suma/:a/:b", function(req,res){
    var suma=parseInt(req.params.a)+parseInt(req.params.b)
    res.send(""+suma);
});

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"))
})
//=================================Mobila=========================
app.get("/mobila", function(req, res){
    console.log(req.query)
    var conditieQuery="";
    if (req.query.tip){
        conditieQuery=` where camera_mobila='${req.query.tip}'`//tip?
    }
    client.query("select * from unnest(enum_range(null::tipuri_mobila))", function(err, rezOptiuni){

        client.query(`select * from mobila ${conditieQuery}`, function(err, rez){
            if (err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else{
                res.render("pagini/mobila", {mobila: rez.rows, optiuni:rezOptiuni.rows})
            }
        })
    });
})
/*app.get("/mobila", function(req, res){
    client.query("select * from mobila", function(err, rez){
        if (err) {
            // Handle the error
            console.error("Error executing query:", err);
            // Optionally, you can send an error response to the client
            return res.status(500).send("Internal Server Error");
        }
        // Check if rez exists and has rows
        if (rez && rez.rows) {
            res.render("pagini/mobila", {mobila: rez.rows, optiuni:[]});
        } else {
            // Handle the case where no rows were returned
            console.error("No rows returned from the query");
            // Optionally, you can send a message to the client
            return res.status(404).send("No data found");
        }
        
    })
})
*/
app.get("/mobilier/:id",function(req,res){
    client.query(`select * from mobila where id=${req.params.id}`,function(err,rez){
        if(err) {
            console.log(err);
            afisareEroare(res,2);
                }
        else{
            res.render("pagini/mobilier",{mob: rez.rows[0]})
        }
    })

})
/*==============================Produse================================*/

app.get("/produse", function(req, res){
    console.log(req.query)
    var conditieQuery="";
    if (req.query.tip){
        conditieQuery=` where tip_produs='${req.query.tip}'`
    }
    client.query("select * from unnest(enum_range(null::categ_prajitura))", function(err, rezOptiuni){

        client.query(`select * from prajituri ${conditieQuery}`, function(err, rez){
            if (err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else{
                res.render("pagini/produse", {produse: rez.rows, optiuni:rezOptiuni.rows})
            }
        })
    });
})

app.get("/produs/:id",function(req,res){
    client.query(`select * from prajituri where id=${req.params.id}`,function(err,rez){
        if(err) {
            console.log(err);
            afisareEroare(res,2);
                }
        else{
            res.render("pagini/produs",{prod: rez.rows[0]})
        }
    })

})
//=============================salvare utilizator=============================
app.post("/inregistrare",function(req, res){
    var username;
    var poza;
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){//4
        console.log("Inregistrare:",campuriText);


        console.log(campuriFisier);
        console.log(poza, username);
        var eroare="";


        // TO DO var utilizNou = creare utilizator
        var utilizatorNou=new utilizator()//?
        try{
            utilizNou.setareNume=campuriText.nume;
            utilizNou.setareUsername=campuriText.username;
            utilizNou.email=campuriText.email
            utilizNou.prenume=campuriText.prenume
           
            utilizNou.parola=campuriText.parola;
            utilizNou.culoare_chat=campuriText.culoare_chat;
            utilizNou.poza= poza;
            Utilizator.getUtilizDupaUsername(campuriText.username, {}, function(u, parametru ,eroareUser ){
                if (eroareUser==-1){//nu exista username-ul in BD
                    //TO DO salveaza utilizator
                    utilzNiou.salvareUtilizator()//?
                }
                else{
                    eroare+="Mai exista username-ul";
                }


                if(!eroare){
                    res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})
                   
                }
                else
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
            })
           


        }
        catch(e){
            console.log(e);
            eroare+= "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
        }
   






    });
    formular.on("field", function(nume,val){  // 1
   
        console.log(`--- ${nume}=${val}`);
       
        if(nume=="username")
            username=val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
       
        console.log(nume,fisier);
        //TO DO adaugam folderul poze_uploadate ca static si sa fie creat de aplicatie
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului (variabila folderUser)
        var folderUser = path.join(__dirname,"poze_uploadate",username);

        if(!fs.existsSync(folderUser))
                fs.mkdirSync(folderUser);
       
        fisier.filepath=path.join(folderUser, fisier.originalFilename)
        poza=fisier.originalFilename;
        //fisier.filepath=folderUser+"/"+fisier.originalFilename
        console.log("fileBegin:",poza)
        console.log("fileBegin, fisier:",fisier)


    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    });
});


app.get(new RegExp("^\/[A-Za-z\/0-9]*\/$"), function (req, res) {
    afisareEroare(res, 403);
})
app.get("/*.ejs", function (req, res) {
    afisareEroare(res, 400);
})

app.get("/*", function (req, res) {
    //console.log(req.url)
    try {
        res.render("pagini" + req.url, function (err, rezHtml) {
            // console.log(rezHtml);
            // console.log("Eroare:" + err)
            if (err) {
                if (err.message.startsWith("Failed to lookup view")) {
                    afisareEroare(res, 404);
                    console.log("Nu a gasit pagina: ", req.url)
                }
            }
            else{
                res.send(rezHtml);
            }
        });
    }
    catch (err1) {
        if (err1.message.startsWith("Cannot find module")) {
            afisareEroare(res, 404);
            console.log("Nu a gasit resursa: ", req.url)
        }
        else {
            afisareEroare(res);
            console.log("Eroare:" + err1)
        }
    }
})
        

function initErori(){
    var continut=fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8")
    console.log(continut);

    obGlobal.obErori=JSON.parse(continut);
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza,eroare.imagine)
    }
    obGlobal.obErori.eroare_default=path.join(obGlobal.obErori.cale_baza,obGlobal.obErori.eroare_default.imagine)
    console.log(obGlobal.obErori);
}

initErori()

function afisareEroare(res, _identificator, _titlu, _text, _imagine){
    let eroare=obGlobal.obErori.info_erori.find(
        function(elem){
            return elem.identificator=_identificator
        }
    )
    if(!eroare){
        let eroare_default=obGlobal.obErori.eroare_default;
        res.render("eroare", {
            titlu: _titlu || eroare_default.titlu,
            text: _text || eroare_default.text,
            imagine: _imagine || eroare_default.imagine
        })//al doilea arg este locals
        return;
    }
    else{
        if(eroare.status)
            res.status(eroare.identificator)
        res.render("pagini/eroare", {
            titlu: _titlu || eroare.titlu,
            text: _text || eroare.text,
            imagine: _imagine || eroare.imagine
        })
    }
}
//===========================================================

function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"/resurse/json/galerie.json")).toString("utf-8");
    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(caleAbs, "mediu");
    let caleAbsMic=path.join(caleAbs, "mic");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);
    console.log(caleAbs);
     //for (let i=0; i< vErori.length; i++ )
     for (let imag of vImagini){
        /*[numeFis, ext]=imag.fisier.split("."); *///ex
        [numeFis, ext]=imag.fisier_imagine.split(".");
        let caleFisAbs=path.join(caleAbs,imag.fisier_imagine);
        console.log(caleFisAbs);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" );
        /*------pt.mic-------*/
        let caleFisMicAbs=path.join(caleAbsMic, numeFis+".webp");
        sharp(caleFisAbs).resize(200).toFile(caleFisMicAbs);
        imag.fisier_mic=path.join("/", obGlobal.obImagini.cale_galerie,"mic",numeFis+".webp" );
        imag.fisier_imagine=path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier_imagine );
     }

     
}
initImagini();

//==================================================================

function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss){

        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    

    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss
    //TO DO
    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    //console.log("Compilare SCSS",rez);
}
//compileazaScss("a.scss");
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

app.listen(8080);//port de ascultare
console.log("Serverul a pornit");


