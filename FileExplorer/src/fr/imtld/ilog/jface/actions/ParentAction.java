package fr.imtld.ilog.jface.actions;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.eclipse.jface.action.Action;
import org.eclipse.jface.viewers.TableViewer;

import fr.imtld.ilog.jface.FileExplorer;
import fr.imtld.ilog.jface.utils.FileUtils;

public class ParentAction extends Action {
	protected FileExplorer expl;

	public ParentAction(FileExplorer fileExplorer) {
		expl = fileExplorer;
		setText("P&arent");
		setToolTipText("Go to parent folder");
	}

	@Override
	public void run() {
		expl.setStatus(FileExplorer.Status.SEARCHING.getMsg());
		TableViewer tb = expl.getTableViewer();
		if (tb.getInput() instanceof FileObject) {
			FileObject fo = (FileObject) tb.getInput();	
			try {
				FileObject parent = fo.getParent();
				if(parent != null)
					tb.setInput(parent);
				else if (FileUtils.isArchive(fo))
				{
					tb.setInput(FileUtils.getArchiveParent(fo));
				}
				else
					expl.setStatus(FileExplorer.Status.NO_PARENT.getMsg());
					
			} catch (FileSystemException e) {
				expl.err(e.getMessage());
				expl.setStatus(FileExplorer.Status.ERROR.getMsg());
			}
		}
	}
}
