/**
 * get the administrative request ：add delete modify 
 * when the user send modify request,
 * four parameters we receive are : oldISBN,newISBN,newBookName,newAuthor
 * for the other request, we receive:ISBN,BookName,Author,Operation
 */
function adminiRequest(id,name,author,operation){
	
	
	var book = {
			isbn:id,
			name:name,
			author:author		
	}

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = requestStateHandler;
	var strUrl = "libraryServer.php";
	try{
		xhr.open('post',strUrl,true);
		xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		xhr.send('isbn='+id+"&bookName="+name+"&author="+author+"&operation="+operation);
	}catch(err){
		alert(err.name);
	}
	
}

/**
*get the server response and update the view 
*
*/

function requestStateHandler(){
	var xhr = this;
	if(this.readyState == 4){
		switch(xhr.status){
		case 200:
			{
		//	var state = typeof(xhr.responseText);
			var responseJSON = JSON.parse(xhr.responseText);
			
			var tab = document.getElementById('tabOpera');
			var rows = tab.rows.length;
			var newRow = tab.insertRow(rows);
			var bISBN = newRow.insertCell(0);
			var bName = newRow.insertCell(1);
			var bAuthor = newRow.insertCell(2);
			var bOperation = newRow.insertCell(3);
			bISBN.innerHTML = responseJSON.book.isbn;
			bName.innerHTML = responseJSON.book.name;
			bAuthor.innerHTML = responseJSON.book.author;
			bOperation.innerHTML = responseJSON.operation;

			
			break;
			}
		default:
			alert(xhr.status);
		}
	}
}