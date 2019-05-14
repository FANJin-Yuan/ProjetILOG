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

		// préparer un script dans une chaîne de caractères
		String script = "print('Bonjour le monde !'); 'resultat du script';";
		// l'exécuter et récupèrer son résultat (ici : une chaîne)
		Object resultat = js.eval(script); // affiche Bonjour le monde !
		// on affiche le résultat récupéré.
		System.out.println(resultat); // affichee resultat du script

		// On veut scripter un objet Java
		File f = new File("test.txt");
		// exposer f sous le nom file dans l'objet global de JavaScript
		js.put("file", f);
		// utiliser file en JavaScript : appeler une méthode...
		script = "print(file.getAbsolutePath());";
		js.eval(script);
		// ... ou utiliser la propriété absolutePath (au sens des Java Beans).
		script = "print(file.absolutePath);";
		js.eval(script);

		// déclarer une fonction bonjour en JavaScript
		script = "function bonjour(nom) { print('Bonjour ' + nom); }";
		js.eval(script);
		// NB : le moteur JavaScript implante l'interface Invocable
		Invocable inv = (Invocable) js;
		// appeler la fonction JavaScript depuis Java
		inv.invokeFunction("bonjour", "le monde !");

		// déclarer en JavaScript un objet obj avec une méthode bonjour
		script = "var obj = new Object(); obj.nom = 'obj'; obj.bonjour = "
		                + "function(nom) { print('Bonjour ' + nom); }";
		js.eval(script);
		// récupérer l'objet de nom obj dans l'objet global
		Object obj = js.get("obj");
		// et appeler sa méthode "bonjour"
		inv.invokeMethod(obj, "bonjour", "de la part de la méthode");

		// identifier l'objet global : lui ajouter une propriété nom
		js.eval("var nom = 'scopeGlobal'; print('nom = ' + nom);");
		// déclarer une fonction run dans l'objet global...
		script = "function run() { print('méthode run appelée sur '+ this.nom);}";
		js.eval(script);
		// ... qui peut maintenant être vu comme un Runnable
		// (qui spécifie l'existence d'une méthode public void run())
		Runnable r = inv.getInterface(Runnable.class);
		// démarrer un thread dans la méthode run de l'objet global
		new Thread(r).start();

		// identifier l'objet obj : lui ajouter une propriété nom
		js.eval("obj.nom = 'obj'; print('nom = ' + obj.nom);");
		// ajouter une méthode run à obj ...
		script = "obj.run = function() { print('méthode run appelée sur ' + this.nom); }";
		js.eval(script);
		// voir obj en Java comme un Runnable
		r = inv.getInterface(obj, Runnable.class);
		// démarrer un thread dans la méthode run de obj
		new Thread(r).start();

		// étendre une classe ou une interface depuis JavaScript
		script = "var MyRunnable = Java.extend(java.lang.Runnable, {"
		        + "run: function() { print('hello from Runnable'); }"
		        +"});"
		        +"new java.lang.Thread(new MyRunnable()).start()";
		js.eval(script);

		// utiliser un même moteur avec un autre objet global (scope2)
		Bindings scope2 = js.createBindings();
		scope2.put("nom", "scope2");
		// le 2ème argument de eval spécifie le scope à utiliser
		js.eval("print(nom);", scope2);	}

}
