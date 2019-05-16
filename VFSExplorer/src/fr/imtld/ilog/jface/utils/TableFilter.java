package fr.imtld.ilog.jface.utils;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.eclipse.jface.viewers.Viewer;
import org.eclipse.jface.viewers.ViewerFilter;

import fr.imtld.ilog.jface.FileExplorer;

/**
 * The filter used by the TableViewer of the FileExplorer.
 */
public class TableFilter extends ViewerFilter {
	/**
	 * The FileExplorer using this filter.
	 */
	private FileExplorer expl;

	public TableFilter(FileExplorer explo)
	{
		expl = explo;
	}

	/**
	 * Selecting method of the filter.
	 * Selects elements that are existing files or folders.
	 */
	@Override
	public boolean select(Viewer viewer, Object parent, Object element) {
		if (element instanceof FileObject) {
			try {
				FileObject file = (FileObject) element;
				boolean res = file.exists();
				if (file.isFolder()) {
					try {
						// We try to access children of the folder
						file.getChildren();
					} catch (Exception ignored) {
						// If it raises an exception, then the path to the folder should be wrongly interpreted by VFS
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