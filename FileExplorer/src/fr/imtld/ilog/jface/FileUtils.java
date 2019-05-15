package fr.imtld.ilog.jface;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.apache.commons.vfs2.FileSystemManager;
import org.apache.commons.vfs2.VFS;

public class FileUtils {

	protected static enum ArchiveExtension
	{
		ZIP("zip"), JAR("jar");

		private String value;

		ArchiveExtension(String value) {
			this.value = value;
		}

		public String getValue() {
			return value;
		}
	}
	
	protected static FileSystemManager fm;

	protected static FileSystemManager getFSManager() throws FileSystemException {
		if (fm == null)
			fm = VFS.getManager();
		return fm;
	}

	public static boolean isArchive(FileObject file) {
		String extension = getFileExtension(file);
		return extension.equals(".zip") || extension.equals(".jar");
	}

	/**
	 * Method used to get files and folder names. Had to program it because the
	 * innate methods of FileObject and FileName didn't work with root and hard
	 * drives.
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

	/**
	 * Method used to get friendly paths for the open action. Useful for files
	 * located inside archives
	 **/
	public static String getFriendlyFilePath(FileObject file) {
		if (file != null) {
			String path = file.getName().getFriendlyURI();
			path = path.replace("!", "");
			
			// Removing extension prefixes
			for(ArchiveExtension ex : ArchiveExtension.values())
			{
				path = path.replace(ex.getValue() + ":", "");
			}
			
			return path;
		} else
			return "";
	}

	/**
	 * Method used to get archive files parents. Had to program it because of the
	 * archives FileObjects not retaining their parents
	 **/
	public static FileObject getArchiveParent(FileObject file) {
		if (file != null) {
			try {
				String path = file.getName().getFriendlyURI();
				String extension = getFileExtension(file);
				path = path.replace("!/", "").replace("file:///", "");
				path = path.replace(extension.substring(1) + ":", "");
				path = path.substring(0, path.lastIndexOf("/"));

				FileObject parent = getFSManager().resolveFile(path);
				return parent;
			} catch (FileSystemException e) {
				return null;
			}
		} else
			return null;
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
