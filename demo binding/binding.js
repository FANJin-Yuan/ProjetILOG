function Binding(b) {
	_this = this
	this.elementBindings = []
	this.value = b.object[b.property]
	this.valueGetter = function() {
		return _this.value;
	}

	this.valueSetter = function(val, region) {

		switch (region) {
		case 0:
			_this.value = val

			var vals = val.split(" ")
			var binding1 = _this.elementBindings[1]
			var binding2 = _this.elementBindings[2]

			end = val[val.length - 1]
			if (!isNaN(end)) {
				vals2 = eval(val);
			}

			binding1.element[binding1.attribute] = vals.join();
			binding2.element[binding2.attribute] = vals2

			break;
		case 1:
			_this.value = val
			var vals = val.split(" ")
			var binding2 = _this.elementBindings[2]
			var binding0 = _this.elementBindings[0]

			end = val[val.length - 1]

			if (!isNaN(end)) {
				vals2 = eval(val);
			} else
				vals2 = val;
			binding0.element[binding0.attribute] = vals.join();
			binding2.element[binding2.attribute] = vals2

			break;
		case 2:
			break;
		}

	}
	this.addBinding = function(element, attribute, event, region) {
		var binding = {
			element : element,
			attribute : attribute
		}
		if (event) {
			element.addEventListener(event, function(event) {
				_this.valueSetter(element[attribute], region);
			})
			binding.event = event
		}
		this.elementBindings.push(binding)
		element[attribute] = _this.value
		return _this
	}

	Object.defineProperty(b.object, b.property, {
		get : this.valueGetter,
		set : this.valueSetter
	});

	b.object[b.property] = this.value;
}

var myInputElement1 = document.getElementById("exp")
var myInputElement2 = document.getElementById("verify")
var myDOMElement = document.getElementById("result")

var time = new Date()
var obj = {
	a : "1"
}
new Binding({
	object : obj,
	property : "a"
}).addBinding(myInputElement1, "value", "keyup", 0).addBinding(myInputElement2,
		"value", "keyup", 1).addBinding(myDOMElement, "innerHTML", "keyup", 2)

// function timeconv(date,region){
// if (region == 0){
// // var offset= date.getTimezoneOffset() * 60 * 1000;
// var frTime = date.getTime();
// var gmtTime = new Date (frTime-2*60*60*1000);
// var pkTime = new Date (frTime+6*60*60*1000);
// var frTimeLocalString = date.toLocaleString();
// var gmtTimeLocalString = gmtTime.toLocaleString();
// var pkTimeLocalString = pkTime.toLocaleString();
// console.log("frTime:"+frTimeLocalString,"gmtTime:"+gmtTimeLocalString,"
// pkTime:"+pkTimeLocalString);
// var time = {gmtTimeLocalString, pkTimeLocalString};
// return time;
// }
// else if(region == 1){
// var gmtTime = date.getTime();
// var frTime = new Date(gmtTime+2*60*60*1000);
// var pkTime = new Date(gmtTime+8*60*60*1000);
// var frTimeLocalString = frTime.toLocaleString();
// var gmtTimeLocalString = date.toLocaleString();
// var pkTimeLocalString = pkTime.toLocaleString();
// console.log("frTime:"+frTimeLocalString,"gmtTime:"+gmtTimeLocalString,"
// pkTime:"+pkTimeLocalString);
// var time = {frTimeLocalString, pkTimeLocalString};
// return time;
// }
// }
