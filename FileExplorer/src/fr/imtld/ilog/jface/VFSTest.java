package fr.imtld.ilog.jface;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.apache.commons.vfs2.FileSystemManager;
import org.apache.commons.vfs2.VFS;

public class VFSTest {

	public static void main(String[] args) throws FileSystemException {
		FileSystemManager fm = VFS.getManager();
		FileObject zipFile = fm.resolveFile("c:/DossierTest/Archive.zip");
		System.out.println(FileUtils.getTrueFileName(zipFile));
		System.out.println(FileUtils.getFileExtension(zipFile));
		System.out.println(zipFile.getName().getBaseName());
		
		FileObject dossier = fm.resolveFile("c:/");
		System.out.println(FileUtils.getTrueFileName(dossier));
		
		FileObject[] files = fm.resolveFile("zip:" + zipFile.getName()).getChildren(); 
		System.out.println(files.length);
	}
}
