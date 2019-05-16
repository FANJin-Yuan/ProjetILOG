/**
 * Design Pattern MVVM:
 * View Model for the search request
 */
function searchRequest(id,name,author,operation){
	
	var bookInfo = " "	//initial
	
//	var idInput = document.getElementById("sBookID")
	var searchResult = document.getElementById("searchResult")	//get HTML Element, it will be dinded

	var xhr = new XMLHttpRequest();

	var strUrl = "libraryServer.php";
	try{
		xhr.open('post',strUrl,true);
		xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
		xhr.send('isbn='+id+"&bookName="+name+"&author="+author+"&operation="+operation);
		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && xhr.status == 200){
				bookInfo = xhr.responseText;
				var responseJSON = JSON.parse(xhr.responseText);
			//	bookInfo = responseJSON;
				if(responseJSON.operation == "search" ){
					if(responseJSON.book.isbn != ""){
						/**
						*  get the taget bookInfo
						*/
						var bBookId = responseJSON.book.isbn;
						var bBookName = responseJSON.book.name;
						var bBookAuthor = responseJSON.book.author;
						bookInfo = bBookId + "	" + bBookName + " " + bBookAuthor;
						/**
						*  update the view model 
						*  update the view(html)
						*/
						b.valueSetter(bookInfo)

		
					}else{
						bookInfo = "Not fund";
						b.valueSetter(bookInfo)
					}
	
				}
			}
		
		}
	}catch(err){
		alert(err.name);
	}
	
	var obj = {book:bookInfo}
	/**
	* constructer dataBinding
	*/
	var b = new Binding({
		object: obj,
		property: "book"
	})
	.addBinding(searchResult, "innerHTML", "keyup")
	
}

/**
 * function bind data
 * @param b
 * @returns
 */
function Binding(b) {
    _this = this
	 /**
     * elements binded
     */
    this.elementBindings = []
	/**
     * binding value
     */
    this.value = b.object[b.property]
    this.valueGetter = function(){
        return _this.value;
    }
	/**
	* set value: redifine the banded html element(Dom node)
	*/
    this.valueSetter = function(val){
		_this.value = val
		for (var i = 0; i < _this.elementBindings.length; i++) {
            var binding=_this.elementBindings[i]
            binding.element[binding.attribute] = val
        }		
    }
	
	/**
	* bind a new element
	*/	
    this.addBinding = function(element, attribute, event){
        var binding = {
            element: element,
            attribute: attribute
        }
        if (event){
            element.addEventListener(event, function(event){
                _this.valueSetter(element[attribute]);
            })
            binding.event = event
        }       
        this.elementBindings.push(binding)
        element[attribute] = _this.value
        return _this
    }

    Object.defineProperty(b.object, b.property, {
        get: this.valueGetter,
        set: this.valueSetter
    }); 

    b.object[b.property] = this.value;
}



