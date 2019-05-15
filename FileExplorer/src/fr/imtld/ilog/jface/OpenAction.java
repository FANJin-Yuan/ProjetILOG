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
			} catch (FileSystemException e) {
				expl.err(e.getMessage());
				expl.setStatus(FileExplorer.Status.ERROR.getMsg());
			}
		}
	}
}
