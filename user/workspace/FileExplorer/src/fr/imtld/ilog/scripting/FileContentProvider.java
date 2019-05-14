package fr.imtld.ilog.scripting;

import java.io.File;

import org.eclipse.jface.viewers.ILabelProvider;
import org.eclipse.jface.viewers.ILabelProviderListener;
import org.eclipse.jface.viewers.ITableLabelProvider;
import org.eclipse.jface.viewers.ITreeContentProvider;
import org.eclipse.jface.viewers.Viewer;
import org.eclipse.swt.graphics.Image;

public class FileContentProvider implements ITreeContentProvider, ILabelProvider, ITableLabelProvider {
	protected Image imgFolder = new Image(null, "Folder.gif");
	protected Image imgDoc = new Image(null, "Document.gif");

	@Override
	public void dispose() {
		imgDoc.dispose();
		imgFolder.dispose();
	}

	@Override
	public void inputChanged(Viewer viewer, Object oldInput, Object newInput) {
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
	public Object[] getChildren(Object parent) {
//		if (parent instanceof Root) {
//			Root root = (Root) parent;
//			return root.listFiles();
//		}
		if (parent instanceof File) {
			File file = (File) parent;
			return file.listFiles();
		}
		return null;
	}

	@Override
	public Object getParent(Object element) {
		return null;
	}

	@Override
	public boolean hasChildren(Object element) {
		if (element instanceof File) {
			File file = (File) element;
			return file.isDirectory();
		}
//		if (element instanceof Root)
//			return true;
		return false;
	}

	@Override
	public void addListener(ILabelProviderListener listener) {
	}

	@Override
	public boolean isLabelProperty(Object element, String property) {
		return false;
	}

	@Override
	public void removeListener(ILabelProviderListener listener) {
	}

	@Override
	public Image getImage(Object element) {
		if (element instanceof File) {
			File file = (File) element;
			return file.isFile() ? imgDoc : imgFolder;
		}
//		if (element instanceof Root) {
//			return imgFolder;
//		}
		return null;
	}

	@Override
	public String getText(Object element) {
		if (element instanceof File) {
			File file = (File) element;
			if (file.getParentFile() == null)
				return file.toString();
			return file.getName();
		}
		return null;
	}

	@Override
	public Image getColumnImage(Object element, int columnIndex) {
		if (element instanceof File) {
			File file = (File) element;
			switch (columnIndex) {
			case 0: // Name
				return file.isDirectory() ? imgFolder : imgDoc;
			}
		}
		return null;
	}

	@Override
	public String getColumnText(Object element, int columnIndex) {
		if (element instanceof File) {
			File file = (File) element;
			switch (columnIndex) {
			case 0: // Name
				return file.getName();
			case 1: // Size
				return file.isDirectory() ? "" : file.length() + " bytes";
			}
		}
		return null;
	}
}
