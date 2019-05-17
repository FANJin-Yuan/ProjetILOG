package fr.imtld.ilog.jface.actions;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.eclipse.jface.action.Action;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.viewers.TableViewer;

import fr.imtld.ilog.jface.FileExplorer;

/**
 * Action used to delete a file.
 */
public class DeleteAction extends Action {
	/**
	 * The FileExplorer using this action.
	 */
	protected FileExplorer expl;

	public DeleteAction(FileExplorer e) {
		expl = e;
		setText("Delete");
	}

	@Override
	public void run() {
		TableViewer tbvw = expl.getTableViewer();
		IStructuredSelection sel = (IStructuredSelection) tbvw.getSelection();
		Object elt = sel.getFirstElement();
		if (sel.size() == 1 && elt instanceof FileObject) {
			try {
				@SuppressWarnings("resource")
				FileObject file = (FileObject) elt;
				if (file.exists()) {
					int nb = file.deleteAll();
					expl.getTableViewer().refresh();
					expl.getTreeViewer().refresh();
					expl.setStatus(FileExplorer.Status.DELETED.getMsg());
					expl.out(nb + " files deleted");
				}
			} catch (FileSystemException e) {
				expl.err(e.getMessage());
				expl.setStatus(FileExplorer.Status.ERROR.getMsg());
			}
		}
	}
}
