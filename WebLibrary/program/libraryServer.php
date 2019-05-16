
<?php
/**
 * DESIGN PATTERN: Model
 */

$isbn = $_POST["isbn"];
$bookName = $_POST["bookName"];
$author = $_POST["author"];
$operation = $_POST["operation"];


function add($id,$name,$author){
	$file = fopen('C:\base\libraryBooks.csv','a+');
	fputcsv($file,array($id,$name,$author));
	fclose($file);
}

function modifier($oldid,$id,$name,$author){
	$file = fopen('C:\base\libraryBooks.csv','r');
	$temp_file = fopen('C:\base\libraryBooks_temp.csv','a+');
	$newinfo = array($id,$name,$author);
	while (($data = fgetcsv($file, 1024)) !== FALSE){
		if(reset($data) == $oldid) // this is if you need the first column in a row
			fputcsv($temp_file,$newinfo);
			else
				fputcsv($temp_file,$data);
	}
	fclose($file);
	fclose($temp_file);
	unlink('C:\base\libraryBooks.csv');
	rename('libraryBooks_temp.csv','libraryBooks.csv');
}

function delet($id,$name,$author){
	
	$file = fopen('C:\base\libraryBooks.csv','r');
	$temp_file = fopen('C:\base\libraryBooks_temp.csv','a+');
	
	while (($data = fgetcsv($file, 1024)) !== FALSE){
		if(reset($data) == $id){ // this is if you need the first column in a row
			$array = $data;
			continue;
		}
		fputcsv($temp_file,$data);
	}
	fclose($file);
	fclose($temp_file);
	unlink('C:\base\libraryBooks.csv');
	rename('libraryBooks_temp.csv','libraryBooks.csv');
	return($array);
}

function search($id,$name,$author){
	
	$file = fopen('C:\base\libraryBooks.csv','a+');
	if($id!= null){
		while($array = fgets($file)){
			$cell=explode(",",$array);
			if($id == $cell[0]){
				$author = str_replace(array("\r", "\n"), "", $cell[2]);
				$result = array($cell[0],$cell[1],$author);
				fclose($file);
				return($result);
			}
		}
	}
	elseif($name!= null){
		while($array = fgets($file)){
			$cell=explode(",",$array);
			if(!isset($cell[1])){$cell[1]=null;}
			if($name == $cell[1]){
				$author = str_replace(array("\r", "\n"), "", $cell[2]);
				$result = array($cell[0],$cell[1],$author);
				fclose($file);
				return($result);
			}
		}
	}
	elseif($author!= null){
		while($array = fgets($file)){
			$cell=explode(",",$array);
			if(!isset($cell[2])){$cell[2]=null;}
			if($author == str_replace(array("\r", "\n"), "", $cell[2])){
				$author = str_replace(array("\r", "\n"), "", $cell[2]);
				$result = array($cell[0],$cell[1],$author);
				fclose($file);
				return($result);
			}
		}
	}
	else{
		return null;
	}
	
}





function operation($id,$name,$author,$case){
	
	switch($case){
		case "add":
			add($id,$name,$author);
			break;
		case "delet":
			delet($id,$name,$author);
			break;
		case "search":
			search($id,$name,$author);
			break;
		default:
			modifier($id,$name,$author,$case);
	}
}

if($operation == "delet")
{
	$oldbookName = search($isbn,$bookName,$author)[1];
	$oldauthor = search($isbn,$bookName,$author)[2];
	$oldoperation = "delet";
}

if($operation!== "delet" and $operation!=="search" and $operation !== "add")
{
	$oldbookName = search($isbn,null,null)[1];
	$oldauthor = search($isbn,null,null)[2];
	$oldoperation = "modifier";
}


operation($isbn,$bookName,$author,$operation);


if($operation == "search"){
	echo '{';
	echo '  "book" : {';
	echo '          "isbn" : "'.search($isbn,$bookName,$author)[0].'", "name" : "'.search($isbn,$bookName,$author)[1].'", "author" : "'.search($isbn,$bookName,$author)[2].'"';
	echo '  },';
	echo '	"operation" : "'.$operation.'"';
	echo '}';
}elseif($operation == "add"){
	echo '{';
	echo '  "book" : {';
	echo '          "isbn" : "'.$isbn.'", "name" : "'.$bookName.'", "author" : "'.$author.'"';
	echo '  },';
	echo '	"operation" : "'.$operation.'"';
	echo '}';
}
else{
	echo '{';
	echo '  "book" : {';
	echo '          "isbn" : "'.$isbn.'", "name" : "'.$oldbookName.'", "author" : "'.$oldauthor.'"';
	echo '  },';
	echo '	"operation" : "'.$oldoperation.'"';
	echo '}';
}
?>
