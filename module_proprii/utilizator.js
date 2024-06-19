/*
    parola aplicatie: nxhmcoehgyqjaoxy
*/

const path = require('path');
const AccesBD=require('./accesbd.js');
const parole=require('./parole.js');

const {RolFactory}=require('./roluri.js');
const crypto=require("crypto");
const nodemailer=require("nodemailer");


class Utilizator{
    static tipConexiune="local";
    static tabel="utilizatori"
    static parolaCriptare="tehniciweb";
    static emailServer="test.p.colt02@gmail.com";
    static lungimeCod=64;
    static numeDomeniu="localhost:8080";
    #eroare;
  
    constructor({id, username, nume, prenume, email, parola, rol, culoare_chat="black", poza,data_nastere,telefon}={}) {
        this.id=id;

        //optional sa facem asta in constructor
        try{ //DE CORECTA UITATE PE VIDEO LA CUSU 11 LA SFARSIT
            if(this.checkUsername(username) && this.checkName(nume) && this.checkTelefon && this.checkVarsta 
                && prenume!="" && email!="" && parola!="") {
                this.username = username
                this.nume = nume
                this.prenume =prenume
                this.email= email
                this.parola =parola
                this.telefon=telefon
                this.data_nastere =data_nastere

            }
        }
        catch(e){ this.#eroare=e.message}

        for(let prop in arguments[0]){
            this[prop]=arguments[0][prop]
        }
        if(this.rol)
            this.rol=this.rol.cod? RolFactory.creeazaRol(this.rol.cod):  RolFactory.creeazaRol(this.rol);
        console.log(this.rol);

        this.#eroare="";
    }
    /**
     * Verifica numele utilizatorului
     * @param {string} nume - numele unui utilizator
     * @returns {boolean} - 1 numele e ok/ 0-nu e ok
     */
    checkName(nume){// DE MODIFICAT
        return nume!="" && nume.match(new RegExp("^[A-Z][a-z]+$")) ;
    }
    /**
     * Seteaza numele utilizatorului 
     * @param {string} nume - numele unui utilizator
     */
    set setareNume(nume){
        if (this.checkName(nume)) this.nume=nume
        else{
            throw new Error("Nume gresit")
        }
    }

    /** 
    * folosit doar la inregistrare si modificare profil
    * Seteaza usernamul utilizatorului
    * @param {string} username - numele de utilizator
    * 
    */
    set setareUsername(username){
        if (this.checkUsername(username)) this.username=username
        else{
            throw new Error("Username gresit")
        }
    }
    /**
     * Verifica numele de utilizator 
     * @param {string} username - numele de utilizator
     * @returns {boolean} - 1 ok/ 0 nui ok
     */
    checkUsername(username){
        return username!="" && username.match(new RegExp("^[A-Za-z0-9#_./]+$")) ;
    }
    checkTelefon(telefon){
        if(telefon!="")
            return username.match(new RegExp("/^\+?0\d{9,}$/")) ;
        return true;
    }
    checkVarsta(data_nastere){
        let nastere= new Date(data_nastere);
        let azi = new Date();
        let varsta = azi.getFullYear()-nastere.getFullYear();
        if((nastere > azi || varsta < 18) && data_nastere!="") {
            return false;
        }
        return true; 
    }
    generateToken1(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }
    /**
     * Cripteaza parola utilizatorului
     * @param {string} parola - parola utilizatorului
     * @returns {string} - parola criptata in hexa
     */
    static criptareParola(parola){
        return crypto.scryptSync(parola,Utilizator.parolaCriptare,Utilizator.lungimeCod).toString("hex");
    }
    /**
     * Salveaza utilizatorul in baza de date si si trimite confirmarea acestuia
     */
    salvareUtilizator(){
        let parolaCriptata=Utilizator.criptareParola(this.parola);
        let utiliz=this;
        let token=parole.genereazaToken(100);
        let token2=Math.floor(Date.now() / 1000);
        let token1=this.generateToken1(50);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({tabel:Utilizator.tabel,
            campuri:{
                username:this.username,
                nume: this.nume,
                prenume:this.prenume,
                parola:parolaCriptata,
                email:this.email,
                culoare_chat:this.culoare_chat,
                cod:token,
                poza:this.poza,
                data_nastere: this.data_nastere,
                telefon: this.telefon
            }
            }, function(err, rez){
            if(err)
                console.log(err);
            else
                utiliz.trimiteMail("Salut, stimate"+utiliz.nume,"Username-ul tau este "+utiliz.username+`<b><i><u>pe site-ul Magazin Mobila</b></i></u>`,
            `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod_mail/${token1}-${token2}/${utiliz.username}'>Click aici pentru confirmare</a></p>`)
        });
    }
//dbov zwkc mxes matd

    /**
     * Trimite un mail catre adresa de mail a utilizatorului
     * @param {string} subiect - suboiectului mail-ului trimis
     * @param {string} mesajText - masaju text mail-ului trimis
     * @param {string} mesajHtml -masajuin format html al mail-ului trimis
     * @param {path} atasamente - atasamente mail-ului trimis
     * 
     */
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:Utilizator.emailServer,
                pass:"dbovzwkcmxesmatd"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:Utilizator.emailServer,
            to:this.email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }
   /**
    * Gasasete utilizatoru dupa username
    * @param {string} username - numele utilizatoruluie
    * @returns {object} - utilizatoru cu usernamul valid 
    */
    static async getUtilizDupaUsernameAsync(username){
        if (!username) return null;
        try{
            let rezSelect= await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]
            });
            if(rezSelect.rowCount!=0){
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e){
            console.log(e);
            return null;
        }
        
    }
    /**
     * Gasasete utilizatoru dupa username
     * @param {string} username - numele utilizatoruluie
     * @param {object} obparam - un obiect
     * @param {Function} proceseazaUtiliz -modul in care proceseaza utilizatoru 
     * @returns {object} - utilizatoru cu usernamul valid
     */
 
    static getUtilizDupaUsername (username,obparam, proceseazaUtiliz){
        if (!username) return null;
        let eroare=null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori",campuri:['*'],conditiiAnd:[`username='${username}'`]}, function (err, rezSelect){
            if(err){
                console.error("Utilizator:", err);
                //throw new Error()
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1;
            }
            //constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza}={})
            let u= new Utilizator(rezSelect.rows[0])
            proceseazaUtiliz(u, obparam, eroare);
        });
    }
    /**
     * Verifica daca utilizatorul are un drept
     * @param {*} drept -
     * @returns {Boolean} - da/nu pentru drepturi
     */
    areDreptul(drept){
        return this.rol.areDreptul(drept);
    }
    /**
     * Se ocupa de erori
     * @callback CallBack
     * @param {Error} Error Eventuala eroare in urma queryului
     * @param {object} Object atributele noului utilizator
     */
    /**
     * Metoda ce realizeaza modificarea utilizatorilor
     * @param {object} utilizatorNou - obiectul cu noile date
     * @param {QueryCallBack} callback 
     */
    modifica(utilizatorNou, callback) {
        if (!this.id) {
            throw new Error("Utilizatorul nu există în baza de date.");
        }

        // Construim obiectul cu noile valori
        let campuriDeActualizat = {};
        for (let prop in utilizatorNou) {
            if (utilizatorNou.hasOwnProperty(prop) && utilizatorNou[prop] !== undefined && utilizatorNou[prop] !== null) {
                if (prop === 'parola') {
                    campuriDeActualizat[prop] = Utilizator.criptareParola(utilizatorNou[prop]);
                } else {
                    campuriDeActualizat[prop] = utilizatorNou[prop];
                }
                this[prop] = utilizatorNou[prop];
            }
        }

        // Actualizăm în baza de date
        AccesBD.getInstanta(Utilizator.tipConexiune).update({
            tabel: Utilizator.tabel,
            campuri: campuriDeActualizat,
            conditiiAnd: [`id='${this.id}'`]
        }, function(err, rezUpdate) {
            if (err) {
                console.error("Eroare la actualizarea utilizatorului:", err);
                callback(err, null);
                return;
            }

            if (rezUpdate.rowCount === 0) {
                let eroare = new Error("Utilizatorul nu a fost găsit și nu a putut fi actualizat.");
                callback(eroare, null);
                return;
            }

            console.log(`Utilizatorul cu id-ul ${this.id} a fost actualizat cu succes.`);
            callback(null, rezUpdate);
        }.bind(this)); // Legăm this pentru a accesa this.id în callback
    }
    /**
     * Sterge utilizatorul curent
     */
    sterge(){
        if (!this.id) throw new Error("Utilizatorul nu exista");

        AccesBD.getInstanta(Utilizator.tipConexiune).delete({
            tabel: Utilizator.tabel,
            conditiiAnd: [`id=${this.id}`]
        }, function (err, rez) {
            if (err) {
                console.error("Eroare la stergerea utilizatorului:", err);
                throw new Error("Eroare la stergerea utilizatorului");
            }
        });
    }
    /**
     * Funcție de callback pentru metoda `cauta`.
     * @callback CautareCallback
     * @param {Error|null} err - O eroare, dacă există
     * @param {Utilizator[]} rezultat - Rezultatul căutării ca array de obiecte
     */
    /**
     * Cauta utilizatori
     * @param {object} obParam 
     * @param {CautareCallback} callback -functie ce furnizeaza rezultatul cautarii
     * @returns {void}
     */
    static cauta(obParam,callback){
        let conditii = [];
        for (let prop in obParam) {
            if (obParam[prop] !== undefined) {
                conditii.push(`${prop}='${obParam[prop]}'`);
            }
        }
        if (conditii.length == 0) {
            callback(null, []);
            return;
        }

        AccesBD.getInstanta(Utilizator.tipConexiune).select({
            tabel: Utilizator.tabel,
            campuri: ['*'],
            conditiiAnd: conditii
        }, function (err, rezSelect) {
            if (err) {
                console.error("Eroare la cautarea utilizatorului:", err);
                callback(err, []);
            } else {
                let listaUtiliz = rezSelect.rows.map(row => new Utilizator(row));
                callback(null, listaUtiliz);
            }
        });
    }
    /**
     * Cauta ustilizatori asincron
     * @param {object} obParam - userul pe care sal caute
     * @returns {Array<Utilizator>} -promisiune cu un array de ovbiecte
     */
    async coutaAsync(obParam){
        let conditii = [];
        for (let prop in obParam) {
            if (obParam[prop] !== undefined) {
                conditii.push(`${prop}='${obParam[prop]}'`);
            }
        }
        if (conditii.length == 0) return [];

        try {
            let rezSelect = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync({
                tabel: Utilizator.tabel,
                campuri: ['*'],
                conditiiAnd: conditii
            });
            return rezSelect.rows.map(row => new Utilizator(row));
        } catch (e) {
            console.error("Eroare la cautarea asincronă a utilizatorului:", e);
            return [];
        }
    }
    
}
module.exports={Utilizator:Utilizator}