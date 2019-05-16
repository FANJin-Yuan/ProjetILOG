var File = java.io.File;
var Program = org.eclipse.swt.program.Program;

var tbvw = expl.tableViewer;
var sel = tbvw.selection;
var file = sel.firstElement;
if (sel.size() == 1 && file instanceof File)
	if (file.isFile())
		Program.launch(file.absolutePath);