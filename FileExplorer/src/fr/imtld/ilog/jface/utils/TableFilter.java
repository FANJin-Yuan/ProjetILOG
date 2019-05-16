package fr.imtld.ilog.jface.utils;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.eclipse.jface.viewers.Viewer;
import org.eclipse.jface.viewers.ViewerFilter;

import fr.imtld.ilog.jface.FileExplorer;

public class TableFilter extends ViewerFilter {

	private FileExplorer expl;

	public TableFilter(FileExplorer explo)
	{
		expl = explo;
	}

	@Override
	public boolean select(Viewer viewer, Object parent, Object element) {
		if (element instanceof FileObject) {
			try {
				FileObject file = (FileObject) element;
				boolean res = file.exists();
				if (file.isFolder()) {
					try {
						file.getChildren();
					} catch (Exception ignored) {
						res = false;
					}
				}
				return res;
			} catch (FileSystemException e) {
				expl.err(e.getMessage());
				expl.setStatus(FileExplorer.Status.ERROR.getMsg());
			}
		}
		return false;
	}
}