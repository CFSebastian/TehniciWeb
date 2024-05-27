
const Drepturi=require('./drepturi.js');

/**
 * Clasa Rol reprezintă un rol generic.
 * @class
 */
class Rol{
    static get tip() {return "generic"}
    static get drepturi() {return []}
    constructor (){
        this.cod=this.constructor.tip;
    }
    /**
     * Verifică dacă rolul are un anumit drept.
     * @param {Symbol} drept - Dreptul de verificat.
     * @returns {boolean} - True dacă rolul are dreptul, false altfel.
     */
    areDreptul(drept){ //drept trebuie sa fie tot Symbol
        console.log("in metoda rol!!!!")
        return this.constructor.drepturi.includes(drept); //pentru ca e admin
    }
}
/**
 * Clasa RolAdmin reprezintă rolul de administrator.
 * @class
 * @extends Rol
 */
class RolAdmin extends Rol{
    
    static get tip() {return "admin"}
    constructor (){
        super();
    }
    /**
     * Verifică dacă rolul are un anumit drept (tot timpul adevărat pentru admin).
     * @returns {boolean} - True (adminul are toate drepturile).
     */
    areDreptul(){
        return true; //pentru ca e admin
    }
}
/**
 * Clasa RolModerator reprezintă rolul de moderator.
 * @class
 * @extends Rol
 */
class RolModerator extends Rol{
    
    static get tip() {return "moderator"}
    static get drepturi() { return [
        Drepturi.vizualizareUtilizatori,
        Drepturi.stergereUtilizatori
    ] }
    constructor (){
        super()
    }
}
/**
 * Clasa RolClient reprezintă rolul de client.
 * @class
 * @extends Rol
 */
class RolClient extends Rol{
    static get tip() {return "comun"}
    static get drepturi() { return [
        Drepturi.cumparareProduse
    ] }
    constructor (){
        super()
    }
}
/**
 * Factory de clase
 * @class
 *
 */
class RolFactory{
    /**
     * Creaza un nou rol
     * @param {string} tip - tipul de rol
     * @returns {object<Rol>} -un abiect de tip rol
     */
    static creeazaRol(tip) {
        switch(tip){
            case RolAdmin.tip : return new RolAdmin();
            case RolModerator.tip : return new RolModerator();
            case RolClient.tip : return new RolClient();
        }
    }
}


module.exports={
    RolFactory:RolFactory,
    RolAdmin:RolAdmin
}