package fr.imtld.ilog.jface.actions;

import org.eclipse.jface.action.Action;
import org.eclipse.swt.SWTException;

import fr.imtld.ilog.jface.FileExplorer;

public class ExitAction extends Action {
	protected FileExplorer explo;

	public ExitAction(FileExplorer fileExplorer) {
		explo = fileExplorer;
		setText("E&xit");
		setToolTipText("Exit the application");
	}

	@Override
	public void run() {
		try {
			explo.getTreeViewer().removeSelectionChangedListener(explo);
			explo.getTableViewer().removeDoubleClickListener(explo);
			explo.close();
		} catch (SWTException ignored) {
		}
	}
}
