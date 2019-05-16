package fr.imtld.ilog.scripting;

import java.io.File;

import java.io.FilenameFilter;
import javax.script.ScriptEngine;
import org.eclipse.jface.action.Action;
import org.eclipse.jface.action.MenuManager;
import org.eclipse.jface.viewers.DoubleClickEvent;
import org.eclipse.jface.viewers.IDoubleClickListener;
import org.eclipse.jface.viewers.ISelectionChangedListener;
import org.eclipse.jface.viewers.SelectionChangedEvent;
import org.eclipse.jface.viewers.TableViewer;
import org.eclipse.jface.window.ApplicationWindow;
import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.SashForm;
import org.eclipse.swt.custom.StyledText;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.layout.RowLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Group;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Text;
import org.eclipse.swt.layout.RowData;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;

public class Ihm extends ApplicationWindow implements ISelectionChangedListener, IDoubleClickListener {
	private static final String repertoireUsers = System.getProperty("user.dir") + "\\users";
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
	 * Creation de l'ihm
	 */
	public Ihm() {
		super(null);
//		addToolBar(SWT.FLAT | SWT.WRAP);
		addCoolBar(SWT.FLAT);
		addMenuBar();
		Composite();
		addStatusLine();
	}

	/**
	 * Creation des radioButtons et du champ pour saisir le nom de l'utilisateur.
	 * Permet la creation des workspaces pour les différents utilisateurs si ces derniers n'existent pas.
	 * Permet de lancer le fileExplorer
	 */
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
		defaultUser.setLayoutData(new RowData(132, 86));
		defaultUser.setLayout(new RowLayout(SWT.VERTICAL));

		Label lblChooseYourUser = new Label(defaultUser, SWT.NONE);
		lblChooseYourUser.setText("Choose your user:");

		Button buttonDefaultUser = new Button(defaultUser, SWT.RADIO);
		buttonDefaultUser.setText("Default User");

		Button buttonOtherUser = new Button(defaultUser, SWT.RADIO);
		buttonOtherUser.setText("Other User");

		shlWelcome.setSize(456, 273);

		Composite composite = new Composite(shlWelcome, SWT.NONE);
		composite.setLayoutData(new RowData(167, 93));

		txtEnterUser = new Text(composite, SWT.BORDER);
		txtEnterUser.setBounds(0, 72, 157, 21);
		txtEnterUser.setEditable(false);

		Composite composite_1 = new Composite(shlWelcome, SWT.NONE);
		composite_1.setLayoutData(new RowData(421, 84));

		Button buttonContinuer = new Button(composite_1, SWT.NONE);
		buttonContinuer.setBounds(336, 49, 75, 25);
		buttonContinuer.setText("Continuer");

		buttonContinuer.addSelectionListener(new SelectionAdapter() {
			public void widgetSelected(SelectionEvent event) {
				// Utilisateur par défaut
				if (buttonDefaultUser.getSelection() || checkIfInListOfUsersDirectory(txtEnterUser.getText())) {
					shlWelcome.close();
					FileExplorer.main(null);
				}

				// Utilisateur spécifique
				if (buttonOtherUser.getSelection()) {
					if (txtEnterUser.getText().isEmpty()) {
						// throw new IllegalStateException("Vous devez saisir un nom d'utilisateur");
						MessageBox messageBox = new MessageBox(shlWelcome, SWT.ICON_WARNING | SWT.OK);
						messageBox.setText("Warning");
						messageBox.setMessage("You have to type a user name");
						messageBox.open();
					} else {
						new File(repertoireUsers + "\\" + txtEnterUser.getText().toString()).mkdir();
						new File(repertoireUsers + "\\" + txtEnterUser.getText().toString() + "\\" + "workspace")
								.mkdir();
						shlWelcome.close();
						FileExplorer.main(null);
					}
				}
			}
		});

		SelectionListener selectionListener = new SelectionAdapter() {
			public void widgetSelected(SelectionEvent event) {
				if (buttonDefaultUser.getSelection()) {
					txtEnterUser.setEditable(false);
				} else {
					txtEnterUser.setEditable(true);
				}
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

	/**
	 * Permet de vérifier si l'utilisateur possède déjà un workspace
	 */
	public Boolean checkIfInListOfUsersDirectory(String str) {
		Boolean contains = false;
		File file = new File(repertoireUsers);
		String[] directories = file.list(new FilenameFilter() {
			@Override
			public boolean accept(File current, String name) {
				return new File(current, name).isDirectory();
			}
		});
		for (int i = 0; i < directories.length; i++) {
			if (str.equals(directories[i])) {
				contains = true;
				return contains;
			}
		}
		return contains;
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
	 * Lance l'application
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
