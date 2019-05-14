package fr.imtld.ilog.jface;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.eclipse.jface.action.Action;
import org.eclipse.jface.viewers.TableViewer;

public class ParentAction extends Action {
	protected FileExplorer explo;

	public ParentAction(FileExplorer fileExplorer) {
		explo = fileExplorer;
		setText("P&arent");
		setToolTipText("Go to parent folder");
	}

	@Override
	public void run() {
		TableViewer tb = explo.getTableViewer();
		if (tb.getInput() instanceof FileObject) {
			FileObject fo = (FileObject) tb.getInput();	
			try {
				FileObject parent = fo.getParent();
				if(parent != null)
					tb.setInput(parent);
			} catch (FileSystemException e) {
				e.printStackTrace();
			}
		}
	}
}
