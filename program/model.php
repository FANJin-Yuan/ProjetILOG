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
             $author = str_replace(array("\r", "\n"), "", $cell[2]);
                $result = array($isbn,$bookName,$author);
                fclose($file);
                return($result);
            }
        }
    }
    elseif($name!= null){
          while($array = fgets($file)){
            $cell=explode(",",$array);
           
            if($name == $cell[1]){
                $isbn=$cell[0];
                $bookName=$cell[1];
             $author = str_replace(array("\r", "\n"), "", $cell[2]);
              $result = array($isbn,$bookName,$author);
                fclose($file);
                return($result);
            }
        }
    }
    elseif($author!= null){
      while($array = fgets($file)){
            $cell=explode(",",$array);
            if($id == $cell[0]){
                $isbn=$cell[0];
                $bookName=$cell[1];
             $author = str_replace(array("\r", "\n"), "", $cell[2]);
              $result = array($isbn,$bookName,$author);
                fclose($file);
                return($result);
            }
        }
    }
    else{
       return "wrong input";
    }

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
echo '          "isbn" : "'.search($isbn,$bookName,$author)[0].'", "name" : "'.search($isbn,$bookName,$author)[1].'", "author" : "'.search($isbn,$bookName,$author)[2].'"';
echo '  }';
echo '}'; 
?>