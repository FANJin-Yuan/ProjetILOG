package fr.imtld.ilog.jface.actions;

import org.apache.commons.vfs2.FileObject;
import org.eclipse.jface.action.Action;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.viewers.TableViewer;

import fr.imtld.ilog.jface.FileExplorer;
import fr.imtld.ilog.jface.utils.FileUtils;

/**
 * Action used to copy a file.
 */
public class CopyAction extends Action {
	/**
	 * The FileExplorer using this action.
	 */
	protected FileExplorer expl;

	public CopyAction(FileExplorer e) {
		expl = e;
		setText("Copy");
	}

	@Override
	public void run() {
		TableViewer tbvw = expl.getTableViewer();
		IStructuredSelection sel = (IStructuredSelection) tbvw.getSelection();
		Object elt = sel.getFirstElement();
		if (sel.size() == 1 && elt instanceof FileObject) {
			FileObject file = (FileObject) elt;
			expl.setClipboard(file, FileUtils.getTrueFileName(file));
			expl.setStatus(FileExplorer.Status.COPIED.getMsg());
		}
	}
}
