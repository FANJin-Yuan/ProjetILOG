package fr.imtld.ilog.scripting;

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
		try {
			explo.close();
		} catch (Exception e) {
		}
 	}
}