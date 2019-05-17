package fr.imtld.ilog.jface;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
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
import org.eclipse.swt.widgets.Tree;

import fr.imtld.ilog.jface.actions.CopyAction;
import fr.imtld.ilog.jface.actions.DeleteAction;
import fr.imtld.ilog.jface.actions.ExitAction;
import fr.imtld.ilog.jface.actions.OpenAction;
import fr.imtld.ilog.jface.actions.ParentAction;
import fr.imtld.ilog.jface.actions.PasteAction;
import fr.imtld.ilog.jface.utils.FileUtils;
import fr.imtld.ilog.jface.utils.Root;
import fr.imtld.ilog.jface.utils.TableFilter;
import fr.imtld.ilog.jface.utils.TableSorter;
import fr.imtld.ilog.jface.utils.TreeFilter;

/**
 * Main class of the program. A file explorer using a ContentProvider based on
 * Apache VFS library, allowing to browse folders as well as archive files. The
 * browser consists of a tree representation of the file system on the left of
 * the screen, and a table containing the selection's children : folders and
 * files. It is possible to open the files directly from this explorer.
 */
public class FileExplorer extends ApplicationWindow implements ISelectionChangedListener, IDoubleClickListener {

	/**
	 * Possible statuses of the file explorer
	 */
	public static enum Status {
		READY("Ready"), SEARCHING("Searching..."), OPENING("Opening..."), ERROR("Error"),
		NO_PARENT("No parent directory"), COPIED("File copied"), PASTED("File pasted"),
		EMPTY_CLIPBOARD("Clipboard empty"), DELETED("File deleted");

		private String msg;

		Status(String msg) {
			this.msg = msg;
		}

		public String getMsg() {
			return msg;
		}
	}

	private Action exitAct;
	private Action openAct;
	private Action parentAct;
	private Action copyAct;
	private Action pasteAct;
	private Action deleteAct;

	private TableViewer tbvw;
	private TreeViewer trvw;
	private FileContentProvider cp;

	private SashForm sashExplorer;
	private SashForm sashConsole;
	private StyledText console;
	private Color colBlue;
	private Color colRed;

	private FileObject clipboard = null;
	private String clipboardName;

	/**
	 * Getter for the FileContentProvider instance used by the FileExplorer.
	 * 
	 * @return the FileContentProvider used by the explorer
	 */
	protected FileContentProvider getContentProvider() {
		if (cp == null)
			cp = new FileContentProvider(this);
		return cp;
	}

	/**
	 * Create the application window.
	 */
	public FileExplorer() {
		super(null);
		createActions();
		addMenuBar();
		addCoolBar(SWT.FLAT);
		addStatusLine();
	}

	/**
	 * Create the controls of the explorer's interface.
	 * 
	 * @return the main container Control
	 */
	@Override
	protected Control createContents(Composite shell) {
		createSashFormConsole(shell);
		createActions();
		createPopupMenu();
		setStatus(Status.READY.getMsg());
		return sashExplorer;

	}

	/**
	 * Create the actions used by the explorer.
	 */
	private void createActions() {
		exitAct = new ExitAction(this);
		openAct = new OpenAction(this);
		parentAct = new ParentAction(this);
		copyAct = new CopyAction(this);
		pasteAct = new PasteAction(this);
		deleteAct = new DeleteAction(this);
	}

	/**
	 * Create the menu bar and different sub-menus/buttons.
	 * 
	 * @return the main menu bar
	 */
	@Override
	protected MenuManager createMenuManager() {
		MenuManager mmBar = new MenuManager("menu");
		MenuManager mmFile = new MenuManager("&File");
		mmBar.add(mmFile);
		mmFile.add(exitAct);
		return mmBar;
	}

	/**
	 * Create a secondary menu bar and its buttons.
	 * 
	 * @param style the style used for this CoolBarManager
	 * @return the secondary menu bar
	 */
	@Override
	protected CoolBarManager createCoolBarManager(int style) {
		CoolBarManager coolBarManager = new CoolBarManager(style);
		ToolBarManager tlbmain = new ToolBarManager();
		tlbmain.add(parentAct);
		coolBarManager.add(tlbmain);
		return coolBarManager;
	}

	/**
	 * Create the status line.
	 * 
	 * @return the status line
	 */
	@Override
	protected StatusLineManager createStatusLineManager() {
		StatusLineManager statusLineManager = new StatusLineManager();
		return statusLineManager;
	}

	/**
	 * Create a popup menu for the contextual actions inside the TableViewer.
	 */
	protected void createPopupMenu() {
		MenuManager mmCtx = new MenuManager();
		mmCtx.add(openAct);
		mmCtx.add(copyAct);
		mmCtx.add(pasteAct);
		mmCtx.add(deleteAct);
		Table table = tbvw.getTable();
		Menu mnCtx = mmCtx.createContextMenu(table);
		table.setMenu(mnCtx);
	}

	/**
	 * Create the container for the explorer.
	 * 
	 * @param parent the parent container of this SashForm
	 * @return the SashForm used to contain the explorer (treeview and tableview)
	 */
	protected SashForm createSashFormExplorer(Composite parent) {
		sashExplorer = new SashForm(parent, SWT.NONE);
		createTreeViewer(sashExplorer);
		createTableViewer(sashExplorer);
		sashExplorer.setWeights(new int[] { 1, 3 });
		return sashExplorer;
	}

	/**
	 * Create the container for the console.
	 * 
	 * @param parent the parent container of this SashForm
	 */
	protected void createSashFormConsole(Composite parent) {
		sashConsole = new SashForm(parent, SWT.VERTICAL);
		sashExplorer = createSashFormExplorer(sashConsole);
		createConsole(sashConsole);
		sashConsole.setWeights(new int[] { 3, 1 });
	}

	/**
	 * Create the console.
	 * 
	 * @param parent the parent container of the console
	 */
	protected void createConsole(Composite parent) {
		console = new StyledText(parent, SWT.BORDER | SWT.H_SCROLL | SWT.V_SCROLL);
		Display display = Display.getCurrent();
		colBlue = display.getSystemColor(SWT.COLOR_BLUE);
		colRed = display.getSystemColor(SWT.COLOR_RED);
	}

	/**
	 * Appends some colored text in the console.
	 * 
	 * @param msg the message to print in the console
	 * @param col the color of the message
	 */
	protected void append(String msg, Color col) {
		msg = msg + '\n';
		console.append(msg);
		StyleRange style = new StyleRange();
		style.foreground = col;
		style.length = msg.length();
		style.start = console.getText().length() - style.length;
		console.setStyleRange(style);
	}

	/**
	 * Clears the console.
	 */
	public void clear() {
		console.setText("");
	}

	/**
	 * Append a message in the console with the color blue
	 * 
	 * @param msg the message to print in the console
	 */
	public void out(String msg) {
		append(msg, colBlue);
	}

	/**
	 * Append a message in the console with the color red
	 * 
	 * @param msg the message to print in the console
	 */
	public void err(String msg) {
		append(msg, colRed);
	}

	/**
	 * Create the TreeView on the left of the explorer
	 * 
	 * @param sashForm the parent container of the TreeView
	 */
	@SuppressWarnings("unused")
	protected void createTreeViewer(SashForm sashForm) {
		trvw = new TreeViewer(sashForm, SWT.BORDER);
		trvw.addSelectionChangedListener(this);
		Tree tree = trvw.getTree();

		cp = getContentProvider();
		trvw.setContentProvider(cp);
		trvw.setLabelProvider(cp);

		ViewerFilter filter = new TreeFilter(this);
		trvw.setFilters(new ViewerFilter[] { filter });

		trvw.setInput(new Root());
	}

	/**
	 * Create the TableView on the right of the explorer
	 * 
	 * @param sashForm the parent container of the TableView
	 */
	protected void createTableViewer(SashForm sashForm) {
		tbvw = new TableViewer(sashForm, SWT.BORDER | SWT.FULL_SELECTION);
		FileContentProvider cp = getContentProvider();
		tbvw.setContentProvider(cp);
		tbvw.setLabelProvider(cp);

		TableSorter sorter = new TableSorter(this);
		tbvw.setComparator(sorter);

		ViewerFilter filter = new TableFilter(this);
		tbvw.setFilters(new ViewerFilter[] { filter });

		tbvw.addDoubleClickListener(this);

		Table table = tbvw.getTable();
		table.setHeaderVisible(true);
		TableColumn tcName = new TableColumn(table, SWT.LEFT);
		tcName.setText("Name");
		tcName.setWidth(250);
		TableColumn tcSize = new TableColumn(table, SWT.RIGHT);
		tcSize.setText("Size");
		tcSize.setWidth(150);
		TableColumn tcDate = new TableColumn(table, SWT.RIGHT);
		tcDate.setText("Last modified");
		tcDate.setWidth(150);
	}

	/**
	 * Entry point of the program. Creates a new FileExplorer and runs it.
	 * 
	 * @param args arguments for the main method
	 */
	public static void main(String args[]) {
		try {
			FileExplorer window = new FileExplorer();
			window.run();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Opens the FileExplorer.
	 */
	protected void run() {
		setBlockOnOpen(true);
		open();
		Display.getCurrent().dispose();
	}

	/**
	 * Sets the initial size of the FileExplorer window.
	 * 
	 * @return a Point representing the size of the window
	 */
	@Override
	protected Point getInitialSize() {
		return new Point(800, 500);
	}

	/**
	 * Event triggering when a new element is selected in the TreeView.
	 * 
	 * @param arg the triggering event
	 */
	@Override
	public void selectionChanged(SelectionChangedEvent arg) {
		setStatus(Status.SEARCHING.getMsg());
		ISelection sel = arg.getSelection();
		if (sel instanceof TreeSelection) {
			TreeSelection tsel = (TreeSelection) sel;
			tbvw.setInput(tsel.getFirstElement());
		}
	}

	/**
	 * Event triggering when an element is double-clicked in the TableView.
	 * 
	 * @param e the triggering event
	 */
	@Override
	public void doubleClick(DoubleClickEvent e) {
		setStatus(Status.SEARCHING.getMsg());
		ISelection sel = e.getSelection(); // sélection de la table
		if (sel instanceof StructuredSelection) {
			StructuredSelection ssel = (StructuredSelection) sel;
			Object elt = ssel.getFirstElement();
			if (elt instanceof FileObject) {
				try {
					FileObject file = (FileObject) elt;
					if (file.isFolder() || FileUtils.isArchive(file))
						tbvw.setInput(elt);
					else
						openAct.run();
				} catch (FileSystemException e1) {
					err(e1.getMessage());
					setStatus(Status.ERROR.getMsg());
				}
			}
		}
	}

	/**
	 * Configure the window Shell (text and icon)
	 * 
	 * @param newShell the Shell to configure
	 */
	@Override
	protected void configureShell(Shell newShell) {
		super.configureShell(newShell);
		newShell.setText("VFS Explorer");
		newShell.setImage(FileUtils.loadImage("Folder.gif", true));
	}

	/**
	 * Getter for the TableViewer
	 * 
	 * @return the explorer's TableViewer
	 */
	public TableViewer getTableViewer() {
		return tbvw;
	}

	/**
	 * Getter for the TreeViewer
	 * 
	 * @return the explorer's TreeViewer
	 */
	public TreeViewer getTreeViewer() {
		return trvw;
	}

	/**
	 * Getter for the clipboard
	 * 
	 * @return the explorer's clipboard
	 */
	public FileObject getClipboard() {
		return clipboard;
	}

	/**
	 * Getter for the clipboard file name
	 * 
	 * @return the clipboard's file name
	 */
	public String getClipboardName() {
		return clipboardName;
	}

	/**
	 * Setter for the clipboard
	 * 
	 * @param clipboard the FileObject kept in the clipboard
	 * @param name      the file's name
	 */
	public void setClipboard(FileObject clipboard, String name) {
		this.clipboard = clipboard;
		this.clipboardName = name;
	}
}
