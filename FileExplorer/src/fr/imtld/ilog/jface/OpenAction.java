package fr.imtld.ilog.jface;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.eclipse.jface.action.Action;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.viewers.TableViewer;
import org.eclipse.swt.program.Program;

public class OpenAction extends Action {
	protected FileExplorer expl;

	public OpenAction(FileExplorer e) {
		expl = e;
		setText("Open");
	}

	@Override
	public void run() {
		TableViewer tbvw = expl.getTableViewer();
		IStructuredSelection sel = (IStructuredSelection) tbvw.getSelection();
		Object elt = sel.getFirstElement();
		if (sel.size() == 1 && elt instanceof FileObject) {
			try {
				if (((FileObject) elt).isFile())
					Program.launch(((FileObject) elt).getName().getFriendlyURI());
			} catch (FileSystemException e) {
				e.printStackTrace();
			}
		}
	}
}
