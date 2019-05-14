package fr.imtld.ilog.scripting;

import java.io.File;
import java.io.FileFilter;
import java.io.FileReader;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.eclipse.jface.action.Action;
import org.eclipse.jface.action.CoolBarManager;
import org.eclipse.jface.action.MenuManager;
import org.eclipse.jface.action.StatusLineManager;
import org.eclipse.jface.action.ToolBarManager;
import org.eclipse.jface.viewers.DoubleClickEvent;
import org.eclipse.jface.viewers.IDoubleClickListener;
import org.eclipse.jface.viewers.ISelection;
import org.eclipse.jface.viewers.ISelectionChangedListener;
import org.eclipse.jface.viewers.SelectionChangedEvent;
import org.eclipse.jface.viewers.StructuredSelection;
import org.eclipse.jface.viewers.TableViewer;
import org.eclipse.jface.viewers.TreeSelection;
import org.eclipse.jface.viewers.TreeViewer;
import org.eclipse.jface.viewers.ViewerFilter;
import org.eclipse.jface.window.ApplicationWindow;
import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.SashForm;
import org.eclipse.swt.custom.StyleRange;
import org.eclipse.swt.custom.StyledText;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Menu;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableColumn;
//import org.eclipse.swt.widgets.Tree;

public class FileExplorer extends ApplicationWindow implements ISelectionChangedListener, IDoubleClickListener {
	protected Action actExit;
	protected TableViewer tbvw;
//	protected OpenAction actOpen;
	protected FileContentProvider cp;
// scripting related {{
	protected File filScripts;
	protected Color colBlue;
	protected Color colRed;
	protected Control sashExplorer;
	protected SashForm sashConsole;
	protected StyledText console;
// }} scripting related
	protected ScriptEngine js;
	protected Action[] actaMenus;
	protected Action[] actaPopups;
	protected MenuManager mmBar;

	/**
	 * Create the application window.
	 */
	public FileExplorer() {
		super(null);
		createActions();
//		addToolBar(SWT.FLAT | SWT.WRAP);
		addCoolBar(SWT.FLAT);
		addMenuBar();
		addStatusLine();
	}

//	protected Control createContents(Composite shell) {
//		Control sashForm = createSashFormExplorer(shell);
//		createPopupMenu();
//		setStatus("Ready.");
//		return sashForm;
//}
	
// scripting related {{
	/**
	 * Create contents of the application window.
	 * 
	 * @param shell
	 */
	@Override
	protected Control createContents(Composite parent) {
	        createSashFormConsole(parent);
	        createMenuActions();
	        createMenu();
	        createPopupMenu();
	        setStatus("Ready.");
	        return sashExplorer;
	}

	protected void createSashFormConsole(Composite parent) {
	        sashConsole = new SashForm(parent, SWT.VERTICAL);
	        sashExplorer = createSashFormExplorer(sashConsole);
	        createConsole(sashConsole);
	        checkScripting();
	        int weightConsole = js==null ? 0 : 1;
	        sashConsole.setWeights(new int[] { 3, weightConsole });
	}

	protected void createConsole(Composite parent) {
	        console = new StyledText(parent, SWT.BORDER | SWT.H_SCROLL | SWT.V_SCROLL);
	        Display display = Display.getCurrent();
	        colBlue = display.getSystemColor(SWT.COLOR_BLUE);
	        colRed = display.getSystemColor(SWT.COLOR_RED);
	}

	protected void append(String msg, Color col) {
	        msg = msg+'\n';
	        console.append(msg);
	        StyleRange style = new StyleRange();
	        style.foreground = col;
	        style.length = msg.length();
	        style.start = console.getText().length() - style.length;
	        console.setStyleRange(style);
	}

	public void clear() {
	        console.setText("");
	}

	public void out(String msg) {
	        append(msg, colBlue);
	}

	public void err(String msg) {
	        append(msg, colRed);
	}

	protected void checkScripting() {
		if (filScripts == null)
			filScripts = new File("scripts");
		if (js == null && filScripts.isDirectory()) {
			ScriptEngineManager factory = new ScriptEngineManager();
			js = factory.getEngineByName("JavaScript");
			js.put("expl", this);
		}
	}

	protected File[] getScripts(String namDir) {
		File file = new File(filScripts, namDir);
		File[] filaJS = file.listFiles(new FileFilter() {
			@Override
			public boolean accept(File filCand) {
				return filCand.isFile() && filCand.toString().endsWith(".js");
			}
		});
		if (filaJS == null) filaJS = new File [0];
		return filaJS;
	}

	protected void evalScript(File filJS) {
		FileReader fr;
		try {
			fr = new FileReader(filJS);
			js.eval(fr);
			fr.close();
		} catch (ScriptException e) {
			err(e.toString());
		} catch (Exception e) {
			StackTraceElement[] elts = e.getStackTrace();
			for (int j = 0; j < elts.length; j++)
				err(elts[j].toString());
		}
	}

	protected Action createScriptAction(File filJS) {
		Action act = new Action() {
			@Override
			public void run() {
				evalScript(filJS);
			}
		};
		act.setText(filJS.getName());
		return act;
	}

	protected Action[] createActions(String namDir) {
		// pour créer les actions liées au scripting
		File[] filaJS = getScripts(namDir);
		int len = filaJS.length;
		Action[] acta = new Action [len];
		for (int i = 0; i < len; i++)
			acta[i] = createScriptAction(filaJS[i]);
		return acta;
	}

	protected void createMenuActions() {
		if (js != null) {
		    actaMenus = createActions("menus");
		    actaPopups = createActions("contextMenus");
		}
	}

	protected void createMenu() {
		if (js != null && actaMenus.length > 0) {
			MenuManager mmScripting = new MenuManager("&Scripting");
			mmBar.add(mmScripting);
			for (int i = 0; i < actaMenus.length; i++) {
				Action actMenu = actaMenus[i];
				mmScripting.add(actMenu);
			}
			mmBar.update(true);
		}
	}
// }} scripting related

	protected void createPopupMenu() {
		MenuManager mmCtx = new MenuManager();
// script related {{
//		mmCtx.add(actOpen);	// replaced by a scripted equivalent
		for (int i = 0; i < actaPopups.length; i++)
			mmCtx.add(actaPopups[i]);
// }} script related
		Table table = tbvw.getTable();
		Menu mnCtx = mmCtx.createContextMenu(table);
		table.setMenu(mnCtx);
	}

	protected Control createSashFormExplorer(Composite parent) {
		SashForm sashForm = new SashForm(parent, SWT.NONE);
		createTreeViewer(sashForm);
		createTableViewer(sashForm);
		sashForm.setWeights(new int[] { 1, 3 });
		return sashForm;
	}

	protected void createTableViewer(SashForm sashForm) {
		tbvw = new TableViewer(sashForm, SWT.BORDER | SWT.FULL_SELECTION);
		Table table = tbvw.getTable();
		table.setHeaderVisible(true);
		TableColumn tcName = new TableColumn(table, SWT.LEFT);
		tcName.setText("Name");
		tcName.setWidth(300);
		TableColumn tcSize = new TableColumn(table, SWT.RIGHT);
		tcSize.setText("Size");
		tcSize.setWidth(150);
		FileContentProvider cp = new FileContentProvider();
		tbvw.setContentProvider(cp);
		tbvw.setLabelProvider(cp);
		TableSorter sorter = new TableSorter();
		//tbvw.setSorter(sorter);// deprecated
		tbvw.setComparator(sorter);
		tbvw.addDoubleClickListener(this);
	}

	protected void createTreeViewer(SashForm sashForm) {
		TreeViewer trvw = new TreeViewer(sashForm, SWT.BORDER);
		trvw.addSelectionChangedListener(this);
//		Tree tree = trvw.getTree();
		FileContentProvider cp = getContentProvider();
		trvw.setContentProvider(cp);
		trvw.setLabelProvider(cp);
		ViewerFilter filter = new TreeFilter();
		trvw.setFilters(new ViewerFilter[] { filter });
		trvw.setInput(new Root());
	}

	protected FileContentProvider getContentProvider() {
		if (cp == null)
			cp = new FileContentProvider();
		return cp;
	}

	/**
	 * Create the actions.
	 */
	protected void createActions() {
		actExit = new ExitAction(this);
//		actOpen = new OpenAction(this);	// replaced by a scripted equivalent
	}

	/**
	 * Create the menu manager.
	 * 
	 * @return the menu manager
	 */
	@Override
	protected MenuManager createMenuManager() {
//		MenuManager mmBar = new MenuManager("menu");
		mmBar = new MenuManager("menu");
		MenuManager mmFile = new MenuManager("&File");
		mmBar.add(mmFile);
		mmFile.add(actExit);
		return mmBar;
	}

	/**
	 * Create the coolbar manager.
	 * 
	 * @return the coolbar manager
	 */
	@Override
	protected CoolBarManager createCoolBarManager(int style) {
		CoolBarManager coolBarManager = new CoolBarManager(style);
		ToolBarManager tlbmain = new ToolBarManager();
		tlbmain.add(actExit);
		coolBarManager.add(tlbmain);
		coolBarManager.update(true);
		return coolBarManager;
	}

	/*
	 * Create the toolbar manager.
	 * 
	 * @return the toolbar manager
	 *
	@Override
	protected ToolBarManager createToolBarManager(int style) {
		ToolBarManager tlbMain = new ToolBarManager(style);
		tlbMain.add(actExit);
		return tlbMain;
	}*/

	/**
	 * Create the status line manager.
	 * 
	 * @return the status line manager
	 */
	@Override
	protected StatusLineManager createStatusLineManager() {
		StatusLineManager statusLineManager = new StatusLineManager();
		return statusLineManager;
	}

	/**
	 * Launch the application.
	 * 
	 * @param args
	 */
	public static void main(String args[]) {
		try {
			FileExplorer window = new FileExplorer();
			window.run();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	protected void run() {
		setBlockOnOpen(true);
		open();
		Display.getCurrent().dispose();
	}

	/**
	 * Configure the shell.
	 * 
	 * @param newShell
	 */
	@Override
	protected void configureShell(Shell newShell) {
		super.configureShell(newShell);
		newShell.setText("File Explorer");
	}

	/**
	 * Return the initial size of the window.
	 */
	@Override
	protected Point getInitialSize() {
		return new Point(600, 400);
	}

	@Override
	public void selectionChanged(SelectionChangedEvent event) {
		ISelection sel = event.getSelection();
		if (sel instanceof TreeSelection) {
			TreeSelection tsel = (TreeSelection) sel;
			Object elt = tsel.getFirstElement();
			tbvw.setInput(elt);
		}
	}

	public TableViewer getTableViewer() {
		return tbvw;
	}

	@Override
	public void doubleClick(DoubleClickEvent e) {
		ISelection sel = e.getSelection(); // sélection de la table
		if (sel instanceof StructuredSelection) {
			StructuredSelection ssel = (StructuredSelection) sel;
			Object elt = ssel.getFirstElement();
			if (elt instanceof File) {
				File file = (File) elt;
				if (file.isDirectory())
					tbvw.setInput(elt);
//				else
//					actOpen.run();
			}
		}
	}
}
