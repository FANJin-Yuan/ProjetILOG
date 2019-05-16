package fr.imtld.ilog.scripting;

import java.util.Properties;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.FileInputStream;

public class PropertyLoader {
	
	/**
	 * Charge la liste des propriétés contenues dans le fichier spécifié
	 * @param filename le fichier contenant les propriétés
	 * @return un objet Properties contenant les propriétés du fichier
	 */
	public static Properties load(String filename) throws IOException, FileNotFoundException {
		Properties properties = new Properties();
		FileInputStream input = new FileInputStream(filename);
		
		try {
			properties.load(input);
			return properties;
		}
		
		finally {
			input.close();
		}
	}
}