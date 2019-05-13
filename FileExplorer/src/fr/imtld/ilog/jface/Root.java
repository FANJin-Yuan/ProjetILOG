package fr.imtld.ilog.jface;

import java.io.File;

public class Root {
	public File[] listFiles() {
		return File.listRoots();
	}
}
