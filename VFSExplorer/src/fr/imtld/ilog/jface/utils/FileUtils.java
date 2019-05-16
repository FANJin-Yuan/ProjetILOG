package fr.imtld.ilog.jface.utils;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.apache.commons.vfs2.FileSystemManager;
import org.apache.commons.vfs2.VFS;
import org.eclipse.swt.SWTException;
import org.eclipse.swt.graphics.Image;

import fr.imtld.ilog.jface.FileExplorer;

/**
 * Class used in various classes of the project to manipulate FileObjects
 * or externalize recurrent treatments.
 */
public class FileUtils {

	/**
	 * Explorable archive extensions
	 */
	protected static enum ArchiveExtension {
		ZIP("zip"), JAR("jar");

		private String value;

		ArchiveExtension(String value) {
			this.value = value;
		}

		public String getValue() {
			return value;
		}
	}
	
	/**
	 * The static instance of the FileSystemManager used by the program.
	 */
	protected static FileSystemManager fm;
	
	/**
	 * Returns a static instance of the FileSystemManager used by the program.
	 * @return the FileSystemManager used by the FileContentProvider
	 */
	public static FileSystemManager getFSManager() throws FileSystemException {
		if (fm == null)
			fm = VFS.getManager();
		return fm;
	}

	/**
	 * Determine if a FileObject is an archive file based on its extension.
	 * @param file the file to analyze
	 * @return true if the file is an archive, else false.
	 */
	public static boolean isArchive(FileObject file) {
		String extension = getFileExtension(file);
		return extension.equals(".zip") || extension.equals(".jar");
	}

	/**
	 * Method used to get files and folder names. Had to program it because the
	 * innate methods of FileObject and FileName didn't work with root and hard
	 * drives.
	 * @param file the file to analyze
	 * @return the file's name
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
	 * @param file the file to analyze
	 * @return the file's URL without VFS specific syntax
	 **/
	public static String getFriendlyFilePath(FileObject file) {
		if (file != null) {
			String path = file.getName().getFriendlyURI();
			path = path.replace("!", "");

			// Removing extension prefixes
			for (ArchiveExtension ex : ArchiveExtension.values()) {
				path = path.replace(ex.getValue() + ":", "");
			}

			return path;
		} else
			return "";
	}

	/**
	 * Method used to get archive files parents. Had to program it because of the
	 * archives FileObjects not retaining their parents
	 * @param file the file to analyze
	 * @return the file's parent in a FileObject form
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

	/**
	 * Method used to get a file's extension.
	 * @param file the file to analyze
	 * @return the file's extension (with the preceding dot)
	 **/
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

	/**
	 * Loads an image from the resource folder "img"
	 * @param path the name of the file to load
	 * @param inJar true if the file is inside the generated jar
	 * @return an Image representing the resource image
	 **/
	public static Image loadImage(String path, boolean inJar) {
		Image newImage = null;
		try {
			if (inJar)
				newImage = new Image(null, FileExplorer.class.getClassLoader().getResourceAsStream(path));
			else
				newImage = new Image(null, path);
		} catch (SWTException ex) {
			System.out.println("Couldn't find " + path);
			ex.printStackTrace();
		}
		return newImage;
	}
}
