package fr.imtld.ilog;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FilenameFilter;
import java.io.IOException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Properties;

public class ConteneurAppli  {
	String[] appls;
	Properties props;
	String jarspath;
	String clsname;
	File[] jars;
	URL[] urls;

	public static File[] getJars(String dir) {
		File filJars = new File(dir);
		File[] jars = null;
		if (filJars.isDirectory()) {
			FilenameFilter flnJars = new FilenameFilter() {
				@Override
				public boolean accept(File dir, String name) {
					return name.endsWith(".jar");
				}
			};
			jars = filJars.listFiles(flnJars);
		}

		return jars;

	}


	public String[] getApps() throws FileNotFoundException, IOException {
		if(appls==null) {
			props = new Properties();
			props.load(new FileReader("conteneur.properties"));
			appls = props.getProperty("applis").split(" ");
		}
		return appls;
	}

	public void runApp(String appname)
			throws ClassNotFoundException, NoSuchMethodException, SecurityException, InstantiationException,
			IllegalAccessException, IllegalArgumentException, InvocationTargetException, IOException {
		setURLs(appname);
		URLClassLoader cl = new URLClassLoader(urls);
		Class<?> cls = cl.loadClass(clsname);
		Constructor ct = cls.getConstructor(new Class[0]);
		Iapplication app = (Iapplication) ct.newInstance();
		Thread thr = new Thread(new Runnable() {
			public void run() {
				Method methodinit;
				Method methodstart;
				Method methodstop;
				Method methoddes;
				try {
					methodinit = cls.getDeclaredMethod("init");
					methodstart = cls.getDeclaredMethod("start");
					methodstop = cls.getDeclaredMethod("stop");
					methoddes = cls.getDeclaredMethod("destroy");
					methodinit.invoke(app);
					methodstart.invoke(app);
					methodstop.invoke(app);
					methoddes.invoke(app);
					
				} catch (NoSuchMethodException | SecurityException e1) {
					
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (IllegalArgumentException e) {
					e.printStackTrace();
				} catch (InvocationTargetException e) {
					e.printStackTrace();
				}
	//			for(Method m : methods) {
			
				//	app.destory();
		//			}
			}
		});
		thr.start();
		System.out.println(app.getClass().getCanonicalName());
		cl.close();
	}


	public void setURLs(String appname) throws FileNotFoundException, IOException, MalformedURLException {
	//	this.getApps();
		jarspath = props.getProperty(appname + ".jarFolder");
		clsname = props.getProperty(appname + ".class");
		jars = getJars(jarspath);
		urls = new URL[jars.length];
		for (int i = 0; i < jars.length; i++) {
			File jar = jars[i];
			urls[i] = new URL("file:///" + jar.getAbsolutePath());
		}
	}

	 public static void main(String[] args) throws Exception {
		ConteneurAppli ca = new ConteneurAppli();
		String[] apps = ca.getApps();
		for (String ss : apps) {
			ca.runApp(ss);
		}
	 }
	
}


