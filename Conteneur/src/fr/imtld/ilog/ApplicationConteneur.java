package fr.imtld.ilog;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.eclipse.jface.action.Action;
import org.eclipse.jface.action.MenuManager;
import org.eclipse.jface.action.StatusLineManager;
import org.eclipse.jface.action.ToolBarManager;
import org.eclipse.jface.window.ApplicationWindow;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Group;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.custom.StyledText;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.FormLayout;
import org.eclipse.swt.layout.FormData;
import org.eclipse.swt.layout.FormAttachment;

public class ApplicationConteneur extends ApplicationWindow implements ServerListener{
	String[] appls;
	Properties props;
	Label lblstatusdaytime;
	Label lblstatushttp;
	Label[] labels;
	Group[] groups;
	Iapplication[] apps;
	Button[] btnInit;
	Button[] btnStart;
	Button[] btnStop; 
	Button[] btndestroy;
	Iapplication DayTimeServer;
	Iapplication HttpServer;
	//private boolean started;
	private Map<Iapplication,String> status = new HashMap<Iapplication,String>();
	/**
	 * Create the application window.
	 */
	public ApplicationConteneur() {
		super(null);
		try {
			init();
		} catch (ClassNotFoundException | NoSuchMethodException | SecurityException | InstantiationException
				| IllegalAccessException | IllegalArgumentException | InvocationTargetException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		createActions();
		addToolBar(SWT.FLAT | SWT.WRAP);
		addMenuBar();
		addStatusLine();
	}
	/**
	 * Initiation le tableau apps, groups, labels etc selon le fichier .properties pour avoir 
	 * les premières versions d'application.
	 */
	
	public void init() throws FileNotFoundException, MalformedURLException, IOException, ClassNotFoundException, NoSuchMethodException, SecurityException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		try {
			getApps();
		} catch (IOException e) {
			e.printStackTrace();
		}
		labels = new Label[appls.length];
		groups = new Group[appls.length];	
		apps= new Iapplication[appls.length];
		btnInit = new Button[appls.length];
		btnStart = new Button[appls.length];
		btnStop= new Button[appls.length];
		btndestroy=new Button[appls.length];
		for(int i=0;i<appls.length;i++)
		{
			URL[] urls=getURLs(appls[i]);	
			URLClassLoader cl = new URLClassLoader(urls);
			System.out.println(cl);
			String clsname = props.getProperty(appls[i] + ".class");
			Class<?> cls= cl.loadClass(clsname);
			Constructor ct=cls.getConstructor(new Class[0]);
			Iapplication a=(Iapplication) ct.newInstance();
			apps[i] = a;
		}
		
	}
	
	/**
	 * Obtenir les fichiers .jar d'une application
	 * @return le tableau de fichier
	 */
	
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
	
	
	/**
	 * Obtenir les applications à lancer dans le conteneur
	 * @return le tableau des noms d'application.
	 */
	public String[] getApps() throws FileNotFoundException, IOException {
		if(appls==null) {
			props = new Properties();
			props.load(new FileReader("conteneur.properties"));
			appls = props.getProperty("applis").split(" ");
		}
		return appls;
	}
	
	public URL[] getURLs(String appname) throws FileNotFoundException, IOException, MalformedURLException {
	//	this.getApps();
		String jarspath = props.getProperty(appname + ".jarFolder");
	
		File[] jars = getJars(jarspath);
		URL[] urls = new URL[jars.length];
		for (int i = 0; i < jars.length; i++) {
			File jar = jars[i];
			urls[i] = new URL("file:///" + jar.getAbsolutePath());
		}
		
		return urls;
	}
	
	/**
	 * Create contents of the application window.
	 * @param parent
	 */
	@Override
	protected Control createContents(Composite parent) {
		Composite container = new Composite(parent, SWT.NONE);
		container.setLayout(new FormLayout());
		groups[0] = new Group(container, SWT.NONE);
		FormData fd_grpDaytimeserver = new FormData();
		fd_grpDaytimeserver.bottom = new FormAttachment(0, 70);
		fd_grpDaytimeserver.right = new FormAttachment(0, 419);
		fd_grpDaytimeserver.top = new FormAttachment(0, 5);
		fd_grpDaytimeserver.left = new FormAttachment(0, 5);
		groups[0].setLayoutData(fd_grpDaytimeserver);
		groups[0].setText(appls[0]);
		groups[0].setLayout(new GridLayout(5, false));
		
		btnInit[0] = new Button(groups[0], SWT.NONE);
		btnInit[0].setLayoutData(new GridData(SWT.CENTER, SWT.CENTER, false, false, 1, 1));
		btnInit[0].setText("init");
		btnInit[0].addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent e) {
				try {
					
					initApp(appls[0]);
				} catch (InstantiationException | IllegalAccessException | IllegalArgumentException
						| InvocationTargetException | NoSuchMethodException | SecurityException | ClassNotFoundException
						| IOException e1) {
					e1.printStackTrace();
				}
			}
		});
		
		btnStart[0] = new Button(groups[0], SWT.NONE);
		btnStart[0].setText("start");
		btnStart[0].addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent e) {				
					runApp(apps[0]);
				} 
		});
		
		btnStop[0] = new Button(groups[0], SWT.NONE);
		btnStop[0].setText("stop");
		btnStop[0].addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent e) {
				
					stopApp(apps[0]);
				} 
				
			
		});
		
		
		btndestroy[0] = new Button(groups[0], SWT.NONE);
		btndestroy[0].addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent e) {
				destroyApp(apps[0]);
			}
		});
		btndestroy[0].setText("destroy");	
		labels[0] = new Label(groups[0], SWT.NONE);
		labels[0].setText("Default.  ");
		//Ajouter la premiere application
		
/*
 * Une boucle pour ajouter les autres applications dans l'interface utilisateur.
 */
		
		for(int i=1;i<appls.length;i++) {
		
			groups[i] = new Group(container, SWT.NONE);
			groups[i].setText(appls[i]);
			groups[i].setLayout(new GridLayout(5, false));
			FormData fd_grpx = new FormData();
			fd_grpx.bottom = new FormAttachment(groups[i-1], 70,  SWT.BOTTOM);
			fd_grpx.right = new FormAttachment(0, 419);
			fd_grpx.top = new FormAttachment(groups[i-1], 6);
			fd_grpx.left = new FormAttachment(0, 5);
			groups[i].setLayoutData(fd_grpx);

			btnInit[i] = new Button(groups[i], SWT.NONE);
			btnInit[i].setText("init");
			int x = i;
			btnInit[i].addSelectionListener(new SelectionAdapter() {
				@Override
				public void widgetSelected(SelectionEvent e) {
					try {
						
						initApp(appls[x]);
					} catch (InstantiationException | IllegalAccessException | IllegalArgumentException
							| InvocationTargetException | NoSuchMethodException | SecurityException | ClassNotFoundException
							| IOException e1) {
						e1.printStackTrace();
					}
				}
			});
			
			btnStart[i] = new Button(groups[i], SWT.NONE);
			btnStart[i].setText("start");
			btnStart[i].addSelectionListener(new SelectionAdapter() {
				@Override
				public void widgetSelected(SelectionEvent e) {
						runApp(apps[x]);					
				}
			});
			
			btnStop[i] = new Button(groups[i], SWT.NONE);
			btnStop[i].setText("stop");
			btnStop[i].addSelectionListener(new SelectionAdapter() {
				@Override
				public void widgetSelected(SelectionEvent e) {
						stopApp(apps[x]);			
				}
			});	
			btndestroy[i] = new Button(groups[i], SWT.NONE);
			btndestroy[i].setText("destroy");
			btndestroy[i].addSelectionListener(new SelectionAdapter() {
				@Override
				public void widgetSelected(SelectionEvent e) {
					destroyApp(apps[x]);		
				}
			});	
			
			
			labels[i] = new Label(groups[i], SWT.WRAP);
			labels[i] .setText("Default.  ");


				}	


		return container;
	}
	
	/*
	 * Mettre à jour les labels d'état dans l'interface utilisateur.
	 * 
	 */
	
	public void serverStopped(int iCause, int iPort,String app) {
		for(int i=0;i<appls.length;i++) {
			String cName = apps[i].getClass().getSimpleName();
			if(app.equals(cName)) {
				 switch (iCause) {
				 case Iapplication.NORMAL: 
					 status.put(apps[i], "by user.");
					 break;
				 case Iapplication.PORT_CONTENTION:
					 status.put(apps[i], "port occupe.");
					 break;
				 }
			}
				
		}

		 asyncupdateUI(app);
	}
	//idem
	
	public void serverInit(String app) {
		for(int i=0;i<appls.length;i++) {
			String cName = apps[i].getClass().getSimpleName();
			if(app.equals(cName)) {
				status.put( apps[i], "Ready.");
				}
		}

		asyncupdateUI(app);
	}
	
	//idem
	public void serverStarted(String app) {
		for(int i=0;i<appls.length;i++) {
			String cName = apps[i].getClass().getSimpleName();
			if(app.equals(cName)) {
				status.put( apps[i], "Started.");
				}
		}

		asyncupdateUI(app);
	}
	
	//idem
	
	public void serverDestroy(String app) {
		for(int i=0;i<appls.length;i++) {
			String cName = apps[i].getClass().getSimpleName();
			if(app.equals(cName)) {
				status.put( apps[i], "Destroyed.");
				}
		}

		updateUI(app);
		
	}
	/*
	 * Appeler les methodes concernées d'une application
	 * 
	 */

	public void destroyApp(Iapplication app) {
		app.destroy();

	}
	
	public void stopApp(Iapplication app) {
		app.stop();
	}
	
	public void runApp(Iapplication app) {
		Thread thr = new Thread(new Runnable() {
			public void run() {
				app.start();
			}
		});
		thr.start();
		
	}
	
/*
 * Initiation d'une application en utilisant le ClassLoader et Réflexion
 * Deploiement à chaud en creant un nouveau ClassLoader.
 * 
 */
	public void initApp(String app) throws FileNotFoundException, 
	IOException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, ClassNotFoundException {
		
		URL[] urls = getURLs(app);
		
		URLClassLoader cl = new URLClassLoader(urls);
		String clsname = props.getProperty(app + ".class");
		Class<?> cls = cl.loadClass(clsname);
		Constructor ct = cls.getConstructor(new Class[0]);
		Method methodinit = cls.getDeclaredMethod("init");
		

		for(int i=0;i<appls.length;i++) {
			String cName = apps[i].getClass().getSimpleName();
			if(app.equals(cName)) {
				apps[i]= (Iapplication) ct.newInstance();
				Method medaddlsn = cls.getDeclaredMethod("addServerlistener",ServerListener.class);
				medaddlsn.invoke(apps[i], this);
				methodinit.invoke(apps[i]);
				
			}
		}
	}
	
	public void updateUI(String app) {
		for(int i=0;i<apps.length;i++) {
			String cName = apps[i].getClass().getSimpleName();
			if(app.equals(cName)) {
				String s = status.get(apps[i]);
				labels[i].setText(s);
			}
		}
		
	}
	public void asyncupdateUI(String app) {
		Display.getDefault().asyncExec(new Runnable() {
			@Override
			public void run() {
				updateUI(app);
			}
		});
		
	}
	

	/**
	 * Create the actions.
	 */
	
	private void createActions() {
		// Create the actions
		
	}

	/**
	 * Create the menu manager.
	 * @return the menu manager
	 */
	@Override
	protected MenuManager createMenuManager() {
		MenuManager menuManager = new MenuManager("menu");
		
		MenuManager menuManageDS = new MenuManager("New MenuManager");
		menuManageDS.setMenuText("DayTimeServer\n");
		menuManager.add(menuManageDS);
		
		MenuManager menuManagerHttp = new MenuManager("New MenuManager");
		menuManagerHttp.setMenuText("HttpServer\n");
		menuManager.add(menuManagerHttp);
		return menuManager;
	}

	/**
	 * Create the toolbar manager.
	 * @return the toolbar manager
	 */
	@Override
	protected ToolBarManager createToolBarManager(int style) {
		ToolBarManager toolBarManager = new ToolBarManager(style);
		return toolBarManager;
	}

	/**
	 * Create the status line manager.
	 * @return the status line manager
	 */
	@Override
	protected StatusLineManager createStatusLineManager() {
		StatusLineManager statusLineManager = new StatusLineManager();
		return statusLineManager;
	}

	/**
	 * Launch the application.
	 * @param args
	 */
	public static void main(String args[]) {
		try {
			ApplicationConteneur window = new ApplicationConteneur();
			window.setBlockOnOpen(true);
			window.open();
			Display.getCurrent().dispose();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Configure the shell.
	 * @param newShell
	 */
	@Override
	protected void configureShell(Shell Conteneur) {
		super.configureShell(Conteneur);
		Conteneur.setText("ApplicationConteneur");
	}

	/**
	 * Return the initial size of the window.
	 */
	@Override
	protected Point getInitialSize() {
		return new Point(450, 300);
	}


	

	
}
