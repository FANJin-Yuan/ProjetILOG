package fr.imtld.ilog.jface;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.eclipse.jface.viewers.Viewer;
import org.eclipse.jface.viewers.ViewerComparator;

public class TableSorter extends ViewerComparator {

	private FileExplorer expl;

	public TableSorter(FileExplorer explo) {
		expl = explo;
	}

	@Override
	public int compare(Viewer viewer, Object e1, Object e2) {
		try {
			FileObject f1 = (FileObject) e1;
			FileObject f2 = (FileObject) e2;
			boolean b1 = f1.isFolder();
			if (b1 == f2.isFolder())
				return FileUtils.getTrueFileName(f1).compareToIgnoreCase(FileUtils.getTrueFileName(f2));
			return b1 ? -1 : +1;
		} catch (FileSystemException ex) {
			expl.err(ex.getMessage());
			expl.setStatus(FileExplorer.Status.ERROR.getMsg());
		}
		return 0;
	}
}
