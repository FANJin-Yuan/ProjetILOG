package fr.imtld.ilog.jface;

import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.eclipse.jface.action.Action;
import org.eclipse.jface.action.CoolBarManager;
import org.eclipse.jface.action.MenuManager;
import org.eclipse.jface.action.Separator;
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
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Menu;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableColumn;
import org.eclipse.swt.widgets.Tree;

public class FileExplorer extends ApplicationWindow implements ISelectionChangedListener, IDoubleClickListener {

	protected Action exitAct;
	protected OpenAction openAct;
	protected ParentAction parentAct;
	protected TableViewer tbvw;
	protected FileContentProvider cp;

	protected FileContentProvider getContentProvider() {
		if (cp == null)
			cp = new FileContentProvider();
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

	@Override
	protected Control createContents(Composite shell) {
		Control container = createSashForm(shell);
		createPopupMenu();
		setStatus("Ready");
		return container;
	}

	private void createActions() {
		exitAct = new ExitAction(this);
		openAct = new OpenAction(this);
		parentAct = new ParentAction(this);
	}

	@Override
	protected MenuManager createMenuManager() {
		MenuManager mmBar = new MenuManager("menu");
		MenuManager mmFile = new MenuManager("&File");
		mmBar.add(mmFile);
		mmFile.add(exitAct);
		return mmBar;
	}

	@Override
	protected CoolBarManager createCoolBarManager(int style) {
		CoolBarManager coolBarManager = new CoolBarManager(style);
		ToolBarManager tlbmain = new ToolBarManager();
		tlbmain.add(exitAct);
		tlbmain.add(new Separator());
		tlbmain.add(parentAct);
		coolBarManager.add(tlbmain);
		return coolBarManager;
	}

	@Override
	protected StatusLineManager createStatusLineManager() {
		StatusLineManager statusLineManager = new StatusLineManager();
		return statusLineManager;
	}

	protected void createPopupMenu() {
		MenuManager mmCtx = new MenuManager();
		mmCtx.add(openAct);
		Table table = tbvw.getTable();
		Menu mnCtx = mmCtx.createContextMenu(table);
		table.setMenu(mnCtx);
	}

	protected Control createSashForm(Composite parent) {
		SashForm sashForm = new SashForm(parent, SWT.NONE);
		createTreeViewer(sashForm);
		createTableViewer(sashForm);
		sashForm.setWeights(new int[] { 1, 3 });
		return sashForm;
	}

	@SuppressWarnings("unused")
	protected void createTreeViewer(SashForm sashForm) {
		TreeViewer trvw = new TreeViewer(sashForm, SWT.BORDER);
		trvw.addSelectionChangedListener(this);
		Tree tree = trvw.getTree();

		cp = getContentProvider();
		trvw.setContentProvider(cp);
		trvw.setLabelProvider(cp);

		ViewerFilter filter = new TreeFilter();
		trvw.setFilters(new ViewerFilter[] { filter });

		trvw.setInput(new Root());
	}

	protected void createTableViewer(SashForm sashForm) {
		tbvw = new TableViewer(sashForm, SWT.BORDER | SWT.FULL_SELECTION);
		FileContentProvider cp = getContentProvider();
		tbvw.setContentProvider(cp);
		tbvw.setLabelProvider(cp);

		TableSorter sorter = new TableSorter();
		tbvw.setComparator(sorter);

		ViewerFilter filter = new TableFilter();
		tbvw.setFilters(new ViewerFilter[] { filter });

		tbvw.addDoubleClickListener(this);

		Table table = tbvw.getTable();
		table.setHeaderVisible(true);
		TableColumn tcName = new TableColumn(table, SWT.LEFT);
		tcName.setText("Name");
		tcName.setWidth(300);
		TableColumn tcSize = new TableColumn(table, SWT.RIGHT);
		tcSize.setText("Size");
		tcSize.setWidth(150);
	}

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

	@Override
	protected Point getInitialSize() {
		return new Point(800, 500);
	}

	@Override
	public void selectionChanged(SelectionChangedEvent arg) {
		ISelection sel = arg.getSelection();
		if (sel instanceof TreeSelection) {
			TreeSelection tsel = (TreeSelection) sel;
			tbvw.setInput(tsel.getFirstElement());
		}
	}

	@Override
	public void doubleClick(DoubleClickEvent e) {
		ISelection sel = e.getSelection(); // sélection de la table
		if (sel instanceof StructuredSelection) {
			StructuredSelection ssel = (StructuredSelection) sel;
			Object elt = ssel.getFirstElement();
			if (elt instanceof FileObject) {
				try {
					FileObject file = (FileObject) elt;
					if (file.isFolder() || FileUtils.getFileExtension(file).equals(".zip")
							|| FileUtils.getFileExtension(file).equals(".jar"))
						tbvw.setInput(elt);
				} catch (FileSystemException e1) {
					e1.printStackTrace();
				}
			}
		}
	}

	@Override
	protected void configureShell(Shell newShell) {
		super.configureShell(newShell);
		newShell.setText("File Explorer");
	}

	public TableViewer getTableViewer() {
		return tbvw;
	}
}
