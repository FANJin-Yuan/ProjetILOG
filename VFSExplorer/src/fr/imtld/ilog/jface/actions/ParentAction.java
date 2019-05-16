package fr.imtld.ilog.jface.actions;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.eclipse.jface.action.Action;
import org.eclipse.jface.viewers.TableViewer;

import fr.imtld.ilog.jface.FileExplorer;
import fr.imtld.ilog.jface.utils.FileUtils;

/**
 * Action used to go to a parent folder in the TableViewer.
 */
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
					// We are using a custom method to get the parent because it is lost by the ZipFileObject
					// after going f+1 in the file tree
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
