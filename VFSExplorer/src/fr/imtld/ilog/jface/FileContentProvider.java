package fr.imtld.ilog.jface;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.vfs2.FileContent;
import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.apache.commons.vfs2.FileSystemManager;
import org.eclipse.jface.viewers.ILabelProvider;
import org.eclipse.jface.viewers.ILabelProviderListener;
import org.eclipse.jface.viewers.ITableLabelProvider;
import org.eclipse.jface.viewers.ITreeContentProvider;
import org.eclipse.swt.graphics.Image;

import fr.imtld.ilog.jface.utils.FileUtils;
import fr.imtld.ilog.jface.utils.Root;

/**
 * The ContentProvider used by the FileExplorer to display elements in its Viewers.
 * Works with the Apache VFS API, allowing greater flexibility compared to the basic java.io library.
 */
public class FileContentProvider implements ITreeContentProvider, ILabelProvider, ITableLabelProvider {

	private Image imgArchive = FileUtils.loadImage("Archive.gif", true);
	private Image imgFolder = FileUtils.loadImage("Folder.gif", true);
	private Image imgDoc = FileUtils.loadImage("Document.gif", true);
	private Image imgJar = FileUtils.loadImage("Jar.gif", true);

	private FileExplorer explo;
	
	/**
	 * Create the content provider.
	 * @param explo the FileExplorer using this provider
	 */
	public FileContentProvider(FileExplorer explo) {
		this.explo = explo;
	}

	/**
	 * Get the children elements of a given parent.
	 * @param parent the element to explore
	 * @return an array of the children elements of the parent
	 */
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

	/**
	 * Method called when the input of the controls using this provider is set.
	 * Determines what elements are to be displayed by those controls.
	 * @param input the input Object
	 * @return an array of the children elements of the input
	 */
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
			} else if (input instanceof Root) { // First call of the method
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

	/**
	 * Unused method.
	 */
	@Override
	public Object getParent(Object arg0) {
		return null;
	}

	/**
	 * Determines if an element has children elements.
	 * @param element the Object to analyze
	 * @return true if the element has children, else false
	 */
	@Override
	public boolean hasChildren(Object element) {
		if (element instanceof FileObject) {
			try {
				FileObject file = (FileObject) element;
				if (file.isFolder())
					return true;
				else {
					if (FileUtils.isArchive(file))
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

	/**
	 * Unused method.
	 */
	@Override
	public void addListener(ILabelProviderListener arg0) {
	}

	/**
	 * Unused method.
	 */
	@Override
	public boolean isLabelProperty(Object arg0, String arg1) {
		return false;
	}

	/**
	 * Unused method.
	 */
	@Override
	public void removeListener(ILabelProviderListener arg0) {
	}

	/**
	 * Returns the icon to be displayed next to the element,
	 * based on its file extension
	 * @param element the Object to analyze
	 * @return the Image to display
	 */
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

	/**
	 * Returns the text representing an element in the Viewers (here, its file/folder name)
	 * @param element the Object to analyze
	 * @return the text to display
	 */
	@Override
	public String getText(Object element) {
		if (element instanceof FileObject) {
			FileObject file = (FileObject) element;
			return FileUtils.getTrueFileName(file);
		}
		return null;
	}

	/**
	 * Dispose the images
	 */
	@Override
	public void dispose() {
		imgDoc.dispose();
		imgFolder.dispose();
		imgArchive.dispose();
		imgJar.dispose();
	}

	/**
	 * Returns the icon to be displayed next to the element in the tableviewer,
	 * based on its file extension
	 * @param element the Object to analyze
	 * @param columnIndex the column in which the image has to be displayed
	 * @return the Image to display
	 */
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

	/**
	 * Returns the text representing an element in the different columns of the tableViewer
	 * @param element the Object to analyze
	 * @param columnIndex the column in which the text has to be displayed
	 * @return the text to display in the column
	 */
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
			case 2: // colonne Date
				if (file.isFile()) {
					long time = content.getLastModifiedTime();
					Date date = new Date(time);
					SimpleDateFormat df2 = new SimpleDateFormat("dd/MM/yy hh:mm");
					return df2.format(date);
				} else
					return "";
			}

		} catch (FileSystemException e) {
			explo.err(e.getMessage());
			explo.setStatus(FileExplorer.Status.ERROR.getMsg());
		}
		return null;
	}

}
