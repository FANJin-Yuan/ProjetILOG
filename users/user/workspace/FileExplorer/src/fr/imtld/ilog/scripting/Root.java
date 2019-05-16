package fr.imtld.ilog.scripting;

import java.io.File;

public class Root implements IFileNode {
	@Override
	public String getName() {
		return "Root";
	}

	@Override
	public Object getParentFile() {
		return null;
	}

	@Override
	public boolean isDirectory() {
		return true;
	}

	@Override
	public boolean isFile() {
		return false;
	}

	@Override
	public File[] listFiles() {
		return File.listRoots();
	}

	@Override
	public String toString() {
		return getName();
	}
}
