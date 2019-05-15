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
import org.eclipse.swt.layout.RowLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Group;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Menu;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableColumn;
//import org.eclipse.swt.widgets.Tree;
import org.eclipse.swt.widgets.Text;
import org.eclipse.swt.layout.RowData;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;

public class Ihm extends ApplicationWindow implements ISelectionChangedListener, IDoubleClickListener {
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
	private Text txtEnterUser;

	/**
	 * Create the application window.
	 */
	public Ihm() {
		super(null);
//		addToolBar(SWT.FLAT | SWT.WRAP);
		addCoolBar(SWT.FLAT);
		addMenuBar();
		Composite();
		addStatusLine();
	}

	private void Composite() {
		Display display = new Display();
        Shell shlWelcome = new Shell(display);
        shlWelcome.setText("Welcome");
 
        RowLayout rl_shlWelcome = new RowLayout();
        rl_shlWelcome.marginLeft = 10;
        rl_shlWelcome.marginTop = 10;
        rl_shlWelcome.spacing = 15;
        shlWelcome.setLayout(rl_shlWelcome);

        Group defaultUser = new Group(shlWelcome, SWT.NONE);
        defaultUser.setLayoutData(new RowData(109, 61));
        defaultUser.setLayout(new RowLayout(SWT.VERTICAL));
 
        Label lblChooseYourUser = new Label(defaultUser, SWT.NONE);
        lblChooseYourUser.setText("Choose your user:");
 
        Button buttonDefaultUser = new Button(defaultUser, SWT.RADIO);
        buttonDefaultUser.setText("Default User");
        
        Button buttonOtherUser = new Button(defaultUser, SWT.RADIO);
        buttonOtherUser.setText("Other User");
 
        shlWelcome.setSize(400, 250);
        
        Composite composite = new Composite(shlWelcome, SWT.NONE);
        composite.setLayoutData(new RowData(167, 77));
        
        txtEnterUser = new Text(composite, SWT.BORDER);
        txtEnterUser.setBounds(0, 56, 157, 21);
        txtEnterUser.setEditable(false);
        
        Composite composite_1 = new Composite(shlWelcome, SWT.NONE);
        composite_1.setLayoutData(new RowData(377, 117));
        
        Button btnContinuer = new Button(composite_1, SWT.NONE);
        btnContinuer.setBounds(292, 82, 75, 25);
        btnContinuer.setText("Continuer");

        SelectionListener selectionListener = new SelectionAdapter () {
            public void widgetSelected(SelectionEvent event) {
               if (buttonDefaultUser.getSelection()) {
            	   txtEnterUser.setEditable(false);
               }else {
            	   txtEnterUser.setEditable(true);}
            };
         };
         
         buttonDefaultUser.addSelectionListener(selectionListener);
        
        shlWelcome.open();
        while (!shlWelcome.isDisposed()) {
            if (!display.readAndDispatch())
                display.sleep();
        }
        display.dispose();
    }
	

	@Override
	public void doubleClick(DoubleClickEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void selectionChanged(SelectionChangedEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	/**
	 * Launch the application.
	 * 
	 * @param args
	 */
	public static void main(String args[]) {
		try {
			Ihm window = new Ihm();
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
}
