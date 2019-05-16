package fr.imtld.ilog.jface.actions;

import org.apache.commons.vfs2.FileObject;
import org.eclipse.jface.action.Action;
import org.eclipse.jface.viewers.IStructuredSelection;
import org.eclipse.jface.viewers.TableViewer;
import org.eclipse.swt.program.Program;

import fr.imtld.ilog.jface.FileExplorer;
import fr.imtld.ilog.jface.utils.FileUtils;

public class OpenAction extends Action {
	protected FileExplorer expl;

	public OpenAction(FileExplorer e) {
		expl = e;
		setText("Open");
	}

	@Override
	public void run() {
		expl.setStatus(FileExplorer.Status.OPENING.getMsg());
		TableViewer tbvw = expl.getTableViewer();
		IStructuredSelection sel = (IStructuredSelection) tbvw.getSelection();
		Object elt = sel.getFirstElement();
		if (sel.size() == 1 && elt instanceof FileObject) {
			try {
				if (((FileObject) elt).isFile())
				{
					String path = FileUtils.getFriendlyFilePath(((FileObject) elt));
					expl.out("Opening file : " + path);
					Program.launch(path);
				}
				expl.setStatus(FileExplorer.Status.READY.getMsg());
			} catch (Exception e) {
				expl.err(e.getMessage());
				expl.setStatus(FileExplorer.Status.ERROR.getMsg());
			}
		}
	}
}
