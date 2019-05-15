/**
 * 
 */

function sendRequest(id,name,author,operation){
	var book = {
			isbn:id,
			name:name,
			author:author		
	}

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = requestStateHandler;
	var strUrl = "model.php";
	try{
		xhr.open('post',strUrl,true);
		xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		xhr.send('isbn='+id+"&bookName="+name+"&author="+author+"&operation="+operation);
	}catch(err){
		alert(err.name);
	}
	
}

function requestStateHandler(){
	var xhr = this;
	if(this.readyState == 4){
		switch(xhr.status){
		case 200:
			{
            var re = xhr.responseText;
			var responseJSON = JSON.parse(xhr.responseText);
			var tab = document.getElementById('tabconv');
			var rows = tab.rows.length;
			var newRow = tab.insertRow(rows);
			var t = newRow.insertCell(0);
			var c1 = newRow.insertCell(1);
			var c2 = newRow.insertCell(2);
			t.innerHTML = responseJSON.book.isbn;
			c1.innerHTML = responseJSON.book.name;
			c2.innerHTML = responseJSON.book.author;
			break;
			}
		default:
			alert(xhr.status);
		}
	}
}

	function clearTabHTML() {
        var tab=document.getElementById('tabconv');
            for(var i=1; i<tab.rows.length;){
                tab.deleteRow(i);
            }
		
	}