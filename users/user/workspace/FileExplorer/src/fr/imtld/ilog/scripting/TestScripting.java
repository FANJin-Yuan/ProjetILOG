package fr.imtld.ilog.scripting;

import java.io.File;

import javax.script.Bindings;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

public class TestScripting {

	public static void main(String[] args) throws Exception {
		// Obtenir le moteur de scripting
		ScriptEngineManager factory = new ScriptEngineManager();
		ScriptEngine js = factory.getEngineByName("JavaScript");

		// pr�parer un script dans une cha�ne de caract�res
		String script = "print('Bonjour le monde !'); 'resultat du script';";
		// l'ex�cuter et r�cup�rer son r�sultat (ici : une cha�ne)
		Object resultat = js.eval(script); // affiche Bonjour le monde !
		// on affiche le r�sultat r�cup�r�.
		System.out.println(resultat); // affichee resultat du script

		// On veut scripter un objet Java
		File f = new File("test.txt");
		// exposer f sous le nom file dans l'objet global de JavaScript
		js.put("file", f);
		// utiliser file en JavaScript : appeler une m�thode...
		script = "print(file.getAbsolutePath());";
		js.eval(script);
		// ... ou utiliser la propri�t� absolutePath (au sens des Java Beans).
		script = "print(file.absolutePath);";
		js.eval(script);

		// d�clarer une fonction bonjour en JavaScript
		script = "function bonjour(nom) { print('Bonjour ' + nom); }";
		js.eval(script);
		// NB : le moteur JavaScript implante l'interface Invocable
		Invocable inv = (Invocable) js;
		// appeler la fonction JavaScript depuis Java
		inv.invokeFunction("bonjour", "le monde !");

		// d�clarer en JavaScript un objet obj avec une m�thode bonjour
		script = "var obj = new Object(); obj.nom = 'obj'; obj.bonjour = "
		                + "function(nom) { print('Bonjour ' + nom); }";
		js.eval(script);
		// r�cup�rer l'objet de nom obj dans l'objet global
		Object obj = js.get("obj");
		// et appeler sa m�thode "bonjour"
		inv.invokeMethod(obj, "bonjour", "de la part de la m�thode");

		// identifier l'objet global : lui ajouter une propri�t� nom
		js.eval("var nom = 'scopeGlobal'; print('nom = ' + nom);");
		// d�clarer une fonction run dans l'objet global...
		script = "function run() { print('m�thode run appel�e sur '+ this.nom);}";
		js.eval(script);
		// ... qui peut maintenant �tre vu comme un Runnable
		// (qui sp�cifie l'existence d'une m�thode public void run())
		Runnable r = inv.getInterface(Runnable.class);
		// d�marrer un thread dans la m�thode run de l'objet global
		new Thread(r).start();

		// identifier l'objet obj : lui ajouter une propri�t� nom
		js.eval("obj.nom = 'obj'; print('nom = ' + obj.nom);");
		// ajouter une m�thode run � obj ...
		script = "obj.run = function() { print('m�thode run appel�e sur ' + this.nom); }";
		js.eval(script);
		// voir obj en Java comme un Runnable
		r = inv.getInterface(obj, Runnable.class);
		// d�marrer un thread dans la m�thode run de obj
		new Thread(r).start();

		// �tendre une classe ou une interface depuis JavaScript
		script = "var MyRunnable = Java.extend(java.lang.Runnable, {"
		        + "run: function() { print('hello from Runnable'); }"
		        +"});"
		        +"new java.lang.Thread(new MyRunnable()).start()";
		js.eval(script);

		// utiliser un m�me moteur avec un autre objet global (scope2)
		Bindings scope2 = js.createBindings();
		scope2.put("nom", "scope2");
		// le 2�me argument de eval sp�cifie le scope � utiliser
		js.eval("print(nom);", scope2);	}

}
