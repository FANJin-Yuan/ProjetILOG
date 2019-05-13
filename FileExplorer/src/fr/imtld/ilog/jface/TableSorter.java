package fr.imtld.ilog.jface;

import java.io.File;

import org.eclipse.jface.viewers.Viewer;
import org.eclipse.jface.viewers.ViewerComparator;

public class TableSorter extends ViewerComparator {
	@Override
	public int compare(Viewer viewer, Object e1, Object e2) {
		File f1 = (File) e1;
		File f2 = (File) e2;
		boolean b1 = f1.isDirectory();
		if (b1 == f2.isDirectory())
			return f1.getName().compareToIgnoreCase(f2.getName());
		return b1 ? -1 : +1;
	}
}

