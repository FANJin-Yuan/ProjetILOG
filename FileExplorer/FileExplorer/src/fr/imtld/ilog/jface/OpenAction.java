package fr.imtld.ilog.jface;

import java.io.File;

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
		if (sel.size() == 1 && elt instanceof File) {
			File file = (File) elt;
			if (file.isFile())
				Program.launch(file.getAbsolutePath());
		}
	}
}
