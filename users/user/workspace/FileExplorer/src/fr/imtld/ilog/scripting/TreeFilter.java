package fr.imtld.ilog.scripting;

import java.io.File;

import org.eclipse.jface.viewers.Viewer;
import org.eclipse.jface.viewers.ViewerFilter;

public class TreeFilter extends ViewerFilter {
	@Override
	public boolean select(Viewer viewer, Object parent, Object element) {
		if (element instanceof File) {
			File file = (File) element;
			return file.getParentFile() == null // drive
					|| file.isDirectory();
		}
		return false;
	}
}
