package fr.imtld.ilog.jface;

import org.eclipse.jface.action.Action;

public class ExitAction extends Action {
	protected FileExplorer explo;

	public ExitAction(FileExplorer fileExplorer) {
		explo = fileExplorer;
		setText("E&xit");
		setToolTipText("Exit the application");
	}

	@Override
	public void run() {
		explo.close();
	}
}
