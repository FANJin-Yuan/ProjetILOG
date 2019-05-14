package fr.imtld.ilog.jface;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.apache.commons.vfs2.FileSystemManager;
import org.apache.commons.vfs2.VFS;

public class FileUtils {

	protected static FileSystemManager fm;

	protected static FileSystemManager getFSManager() throws FileSystemException {
		if (fm == null)
			fm = VFS.getManager();
		return fm;
	}

	/** Method used to get files and folder names. Had to program it 
	* because the innate methods of FileObject and FileName didn't work
	* with root and hard drives.
	**/
	public static String getTrueFileName(FileObject file) {
		String name = "";
		if (file != null) {
			String path = file.getName().getFriendlyURI();
			if (path.endsWith("/")) {
				String[] spl = path.split("/");
				name = spl[spl.length - 1];
			} else
				name = path.substring(path.lastIndexOf("/") + 1);
		}
		return name;
	}

	public static String getFileExtension(FileObject file) {
		String extension = "";
		try {
			if (file != null && file.exists()) {
				String name = file.getPublicURIString();
				extension = name.substring(name.lastIndexOf(".")).replace("!/", "");
			}
		} catch (Exception e) {
			extension = "";
		}
		return extension;
	}
}
