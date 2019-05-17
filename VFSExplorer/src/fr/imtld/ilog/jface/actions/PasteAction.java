package fr.imtld.ilog.jface.actions;

import java.io.IOException;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSelectInfo;
import org.apache.commons.vfs2.FileSelector;
import org.eclipse.jface.action.Action;
import org.eclipse.jface.viewers.TableViewer;

import fr.imtld.ilog.jface.FileExplorer;
import fr.imtld.ilog.jface.utils.FileUtils;

/**
 * Action used to paste a file.
 */
public class PasteAction extends Action {
	/**
	 * The FileExplorer using this action.
	 */
	protected FileExplorer expl;

	public PasteAction(FileExplorer e) {
		expl = e;
		setText("Paste");
	}

	@Override
	public void run() {
		TableViewer tb = expl.getTableViewer();
		if (tb.getInput() instanceof FileObject) {
			FileObject fo = (FileObject) tb.getInput();
			try {
				if (expl.getClipboard() != null) {
					FileObject dest = FileUtils.getFSManager().resolveFile(fo.getName() + "/" + expl.getClipboardName());
					dest.copyFrom(expl.getClipboard(), new FileSelector() {
						@Override
						public boolean traverseDescendents(FileSelectInfo arg0) throws Exception {
							return true;
						}
						@Override
						public boolean includeFile(FileSelectInfo arg0) throws Exception {
							return true;
						}
					});
					expl.getTableViewer().refresh();
					expl.setStatus(FileExplorer.Status.PASTED.getMsg());
					expl.out("File " + expl.getClipboardName() + " copied to path " + dest.getName().getFriendlyURI());
				} else
					expl.setStatus(FileExplorer.Status.EMPTY_CLIPBOARD.getMsg());
			} catch (IOException e) {
				expl.err(e.getMessage());
				expl.setStatus(FileExplorer.Status.ERROR.getMsg());
			}
		}
	}
}
