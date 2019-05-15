<?php

$isbn = $_POST["isbn"];
$bookName = $_POST["bookName"];
$author = $_POST["author"];
$operation = $_POST["operation"];

function add($id,$name,$author){
	$file = fopen('C:\wamp64\www\projet mvvm\base\basebiblio.csv','a+');
  
    fputcsv($file,array($id,$name,$author));
    
    fclose($file);
}

function search($id,$name,$author){
    	$file = fopen('C:\wamp64\www\projet mvvm\base\basebiblio.csv','a+');
    if($id!==null){
        while($array = fgets($file)){
            $cell=explode(",",$array);
         
            if($id == $cell[0]){
                $isbn=$cell[0];
                $bookName=$cell[1];
                $author=$cell[2];
                fclose($file);
                return($bookName);
            }
        }
    }
    elseif($name!= null){
          while($array = fgets($file)){
            $cell=explode(",",$array);
           
            if($name == $cell[1]){
                $isbn=$cell[0];
                $bookName=$cell[1];
                $author=$cell[2];
                fclose($file);
                return($isbn);
    }
    elseif($author!= null){
      while($array = fgets($file)){
            $cell=explode(",",$array);
            if($id == $cell[0]){
                $isbn=$cell[0];
                $bookName=$cell[1];
                $author=$cell[2];
                fclose($file);
                return($isbn);
    }
    else{
       
    }
    }

    function delet($id,$name,$author){
    	$file = fopen('C:\wamp64\www\projet mvvm\base\basebiblio.csv','a+');
  
    while(!feof(file)){
        search($id,$name,$author);
        fputcsv($file,array($name,$author,$id));
    }
   
    
    fclose($file);
	
}

function modifier($id,$name,$author){
	$file = fopen('C:\wamp64\www\projet mvvm\base\basebiblio.csv','a+');
  
    while(!feof(file)){
        search($id,$name,$author);
        fputcsv($file,array($name,$author,$id));
    }
   
    
    fclose($file);
}





function operation($id,$name,$author,$case){
	
	switch($case){
		case "add":
			add($id,$name,$author);
			break;
		case "modifier":
			modifier($id,$name,$author);
			break;
		case "delet":
			delet($id,$name,$author);
			break;
		case "search":
			search($id,$name,$author);
			break;
		default:
			echo "wrong opreation";
	}
}

operation($isbn,$bookName,$author,$operation);


// echo '{';
// echo '  "book" : {';
// echo '          "isbn" : "'.$isbn.'", "name" : "'.$bookName.'", "author" : "'.$author.'"';
// echo '  }';
// echo '}';
echo '{';
echo '  "book" : {';
echo '          "isbn" : "'.$isbn.'", "name" : "'.search($isbn,$bookName,$author).'", "author" : "'.$author.'"';
echo '  }';
echo '}';
?>