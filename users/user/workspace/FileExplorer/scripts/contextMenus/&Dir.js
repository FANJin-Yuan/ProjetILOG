function Visitor() {
}

/**
 * Visite par défaut : afficher le nom.
 * 
 * @param file
 *            Le noeud à visiter.
 */
Visitor.prototype.visit = function(file) {
	var child = new java.io.File(file, '.metadata');
	if (child.exists() && child.isDirectory())
		expl.out(file.absolutePath+'\n');
}


/**
 * Stratégie de visite : ordre, récursion, évitement...
 */
function Strategy() {
}

/**
 * Stratégie par défaut : visite locale puis récursion.
 */
Strategy.prototype.accept = function(file, v) {
	v.visit(file);
	// ne pas propager dans .metadata
	if (file.name.equals('.metadata'))
		return;
	// propager aux noeuds fils
	var files = file.listFiles();
	for (var i in files)
		this.accept(files[i], v)
};


var tbvw = expl.tableViewer;
var sel = tbvw.selection;
switch (sel.size()) {
case 0 :
	expl.err('You must select a folder')
	break;
case 1 :
	var file = sel.firstElement;
	if (! file.isDirectory())
		expl.err('Selection must be a folder');
	else {
		// définir la nature de la visite
		var v = new Visitor();
		// définir la stratégie de visite
		var n = new Strategy();
		n.accept(file, v);
	}
	break;
default :
	expl.err('You must select only one folder')
	break;
} 
