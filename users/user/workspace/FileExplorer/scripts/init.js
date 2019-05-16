var tb = expl.toolBar;
var actions = expl.menuActions;
for (var i in actions) {
	var act = actions[i];
	expl.out(act.text);
	tb.add(act);
}
tb.update(true);

var obj = {
	run: function() {
		expl.out('Bonjour');
	}
};
var Action = org.eclipse.jface.action.Action;
var HelloAction = Java.extend(Action, obj);

var act = new HelloAction();
act.text = 'bonjour';
tb.add(act);
tb.update(true);
