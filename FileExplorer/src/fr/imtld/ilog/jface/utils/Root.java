package fr.imtld.ilog.jface.utils;

import java.io.File;

public class Root {
	public File[] listFiles() {
		return File.listRoots();
	}
}
