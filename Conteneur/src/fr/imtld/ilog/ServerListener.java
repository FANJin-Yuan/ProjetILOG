package fr.imtld.ilog;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import org.eclipse.swt.custom.StyledText;


public interface ServerListener {
	public void stopApp(Iapplication app);
	public void runApp(Iapplication app);
	public void initApp(String app) throws FileNotFoundException, IOException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, ClassNotFoundException;
	public void destroyApp(Iapplication app); 
	
	public void serverInit(String app);
	public void serverStarted(String app);
	public void serverStopped(int iCause, int iPort, String app);
	public void serverDestroy(String app);
	

}
