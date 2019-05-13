package fr.imtld.ilog.jface;

import java.io.File;

import org.eclipse.jface.viewers.ILabelProvider;
import org.eclipse.jface.viewers.ILabelProviderListener;
import org.eclipse.jface.viewers.ITableLabelProvider;
import org.eclipse.jface.viewers.ITreeContentProvider;
import org.eclipse.swt.graphics.Image;

public class FileContentProvider implements ITreeContentProvider, ILabelProvider, ITableLabelProvider {

	protected Image imgFolder = new Image(null, "Folder.gif");
	protected Image imgDoc = new Image(null, "Document.gif");

	@Override
	public Object[] getChildren(Object parent) {
		if (parent instanceof File) {
			File file = (File) parent;
			return file.listFiles();
		}
		return null;
	}

	@Override
	public Object[] getElements(Object input) {
		if (input instanceof File) {
			File filInput = (File) input;
			return filInput.listFiles();
		}

		if (input instanceof Root) {
			Root root = (Root) input;
			return root.listFiles();
		}
		return null;
	}

	@Override
	public Object getParent(Object arg0) {
		return null;
	}

	@Override
	public boolean hasChildren(Object element) {
		if (element instanceof File) {
			File file = (File) element;
			return file.isDirectory();
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
		if (element instanceof File) {
			File file = (File) element;
			return file.isFile() ? imgDoc : imgFolder;
		}
		return null;
	}

	@Override
	public String getText(Object element) {
		if (element instanceof File) {
			File file = (File) element;
			if (file.getParentFile() == null) // drive
				return file.toString();
			return file.getName();
		}
		return null;
	}

	@Override
	public void dispose() {
		imgDoc.dispose();
		imgFolder.dispose();
	}

	@Override
	public Image getColumnImage(Object element, int columnIndex) {
		File file = (File) element;
		switch (columnIndex) {
		case 0: // colonne Name
			return file.isDirectory() ? imgFolder : imgDoc;
		}
		return null;
	}

	@Override
	public String getColumnText(Object element, int columnIndex) {
		File file = (File) element;
		switch (columnIndex) {
		case 0: // colonne Name
			return file.getName();
		case 1: // colonne Size
			return file.isDirectory() ? "" : file.length() + " bytes";
		}
		return null;
	}

}
