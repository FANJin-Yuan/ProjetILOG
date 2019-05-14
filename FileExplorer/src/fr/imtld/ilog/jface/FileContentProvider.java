package fr.imtld.ilog.jface;

import java.io.File;

import org.apache.commons.vfs2.FileContent;
import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.apache.commons.vfs2.FileSystemManager;
import org.eclipse.jface.viewers.ILabelProvider;
import org.eclipse.jface.viewers.ILabelProviderListener;
import org.eclipse.jface.viewers.ITableLabelProvider;
import org.eclipse.jface.viewers.ITreeContentProvider;
import org.eclipse.swt.graphics.Image;

public class FileContentProvider implements ITreeContentProvider, ILabelProvider, ITableLabelProvider {

	protected Image imgArchive = new Image(null, "Archive.gif");
	protected Image imgFolder = new Image(null, "Folder.gif");
	protected Image imgDoc = new Image(null, "Document.gif");
	protected Image imgJar = new Image(null, "Jar.gif");
	
	private FileExplorer explo;

	public FileContentProvider(FileExplorer explo) {
		this.explo = explo;
	}
	
	@Override
	public Object[] getChildren(Object parent) {
		if (parent instanceof FileObject) {
			try {
				FileObject file = (FileObject) parent;
				return file.getChildren();
			} catch (FileSystemException e) {
				explo.err(e.getMessage());
				explo.setStatus(FileExplorer.Status.ERROR.getMsg());
			}
		}
		return null;
	}

	@Override
	public Object[] getElements(Object input) {
		FileObject[] res = null;
		try {
			FileSystemManager fm = FileUtils.getFSManager();
			if (input instanceof FileObject) {
				FileObject file = (FileObject) input;
				if (file.isFolder())
					res = file.getChildren();
				else {
					switch (FileUtils.getFileExtension(file)) {
					case ".zip":
						FileObject archive = fm.resolveFile("zip:" + file.getName());
						res = archive.getChildren();
						break;
					case ".jar":
						FileObject jar = fm.resolveFile("jar:" + file.getName());
						res = jar.getChildren();
						break;
					default:
						res = file.getChildren();
						break;
					}
				}
			} else if (input instanceof Root) {
				Root root = (Root) input;
				File[] files = root.listFiles();
				res = new FileObject[files.length];
				for (int i = 0; i < files.length; ++i) {
					res[i] = fm.toFileObject(files[i]);
				}
			}

		} catch (FileSystemException e) {
			explo.err(e.getMessage());
			explo.setStatus(FileExplorer.Status.ERROR.getMsg());
		}
		explo.setStatus(FileExplorer.Status.READY.getMsg());
		return res;
	}

	@Override
	public Object getParent(Object arg0) {
		return null;
	}

	@Override
	public boolean hasChildren(Object element) {
		if (element instanceof FileObject) {
			try {
				FileObject file = (FileObject) element;
				if (file.isFolder())
					return true;
				else {
					if(FileUtils.isArchive(file))
						return true;
					else
						return false;
					
				}
			} catch (FileSystemException e) {
				explo.err(e.getMessage());
				explo.setStatus(FileExplorer.Status.ERROR.getMsg());
			}
		}
		return false;
	}

	@Override
	public void addListener(ILabelProviderListener arg0) {
	}

	@Override
	public boolean isLabelProperty(Object arg0, String arg1) {
		return false;
	}

	@Override
	public void removeListener(ILabelProviderListener arg0) {
	}

	@Override
	public Image getImage(Object element) {
		if (element instanceof FileObject) {
			try {
				FileObject file = (FileObject) element;
				if (file.isFolder())
					return imgFolder;
				else {
					switch (FileUtils.getFileExtension(file)) {
					case ".zip":
						return imgArchive;
					case ".jar":
						return imgJar;
					default:
						return imgDoc;
					}
				}
			} catch (FileSystemException e) {
				explo.err(e.getMessage());
				explo.setStatus(FileExplorer.Status.ERROR.getMsg());
			}
		}
		return null;
	}

	@Override
	public String getText(Object element) {
		if (element instanceof FileObject) {
			FileObject file = (FileObject) element;
			return FileUtils.getTrueFileName(file);
		}
		return null;
	}

	@Override
	public void dispose() {
		imgDoc.dispose();
		imgFolder.dispose();
		imgArchive.dispose();
		imgJar.dispose();
	}

	@Override
	public Image getColumnImage(Object element, int columnIndex) {
		if (columnIndex == 0) {
			try {
				FileObject file = (FileObject) element;
				if (file.isFolder())
					return imgFolder;
				else {
					switch (FileUtils.getFileExtension(file)) {
					case ".zip":
						return imgArchive;
					case ".jar":
						return imgJar;
					default:
						return imgDoc;
					}
				}
			} catch (FileSystemException e) {
				explo.err(e.getMessage());
				explo.setStatus(FileExplorer.Status.ERROR.getMsg());
			}
		}
		return null;
	}

	@Override
	public String getColumnText(Object element, int columnIndex) {
		try {
			FileObject file = (FileObject) element;
			FileContent content = file.getContent();
			switch (columnIndex) {
			case 0: // colonne Name
				return file.getName().getBaseName();
			case 1: // colonne Size
				return file.isFolder() ? "" : content.getSize() + " bytes";
			}

		} catch (FileSystemException e) {
			explo.err(e.getMessage());
			explo.setStatus(FileExplorer.Status.ERROR.getMsg());
		}
		return null;
	}

}
