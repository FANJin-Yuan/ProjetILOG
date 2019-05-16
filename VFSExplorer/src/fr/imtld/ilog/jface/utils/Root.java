package fr.imtld.ilog.jface.utils;

import java.io.File;

/**
 * Class to represent the root of the system on which the program is executed.
 * Useful because it is not possible to represent the system root in a FileObject instance.
 */
public class Root {
	
	/**
	 * Lists the drives at the root of the system
	 * @return an array of File representing the hard drives of the system
	 */
	public File[] listFiles() {
		return File.listRoots();
	}
}
