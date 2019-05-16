function clearTabHTML(tabconv){
		var tab = document.getElementById('tabOpera');
		var z =tab.rows.length;		
		for(j=1;j<z;j++)
			tab.deleteRow(z-j);
}