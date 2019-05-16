package fr.imtld.ilog.scripting;

import java.io.File;

public interface IFileNode {
	String getName();
	Object getParentFile();
	boolean isFile();
	File[] listFiles();
	boolean isDirectory();
}
