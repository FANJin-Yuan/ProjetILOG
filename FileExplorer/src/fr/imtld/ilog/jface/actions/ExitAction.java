package fr.imtld.ilog.jface.actions;

import org.eclipse.jface.action.Action;

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
		explo.close();
	}
}
