
/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe  pagina cu tabelul de utilizatori.
 @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator
 @property {Symbol} cumparareProduse Dreptul de a cumpara

 @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari

 @property {Symbol} madificareProduse Dreptul de a modifica date despre produse, si produse in general
 @property {Symbol} modificareUtilizator Dreptul de a modifica datele unui cont
 @property {Symbol} vizualizareCod Dreptul de a vizualiza codu sursa
 */


/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */
const Drepturi = {
	vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
	stergereUtilizatori: Symbol("stergereUtilizatori"),
	cumparareProduse: Symbol("cumparareProduse"),
	vizualizareGrafice: Symbol("vizualizareGrafice"),

	madificareProduse: Symbol("madificareProduse"),
	modificareUtilizator: Symbol("modificareUtilizator"),
	vizualizareCod: Symbol("vizualizareCod")
}

module.exports=Drepturi;