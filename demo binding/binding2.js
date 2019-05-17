function Binding(b) {
    _this = this
    this.elementBindings = []
    this.value = b.object[b.property]
    this.valueGetter = function(){
        return _this.value;
    }
    this.valueSetter = function(val,region){
 
		switch(region){
			case 0:
			    _this.value = val

				var i1 = new Number(val) * 1.11
				var i2 = new Number(val) * 0.87
				var i3 = new Number(val) * 7.71
				var binding1 = _this.elementBindings[1]
				var binding2 = _this.elementBindings[2]
				var binding3 = _this.elementBindings[3]
				binding1.element[binding1.attribute] = i1
				binding2.element[binding2.attribute] = i2
				binding3.element[binding3.attribute] = i3
				break;
			case 1:
				_this.value = val

				var i1 = new Number(val) * 0.89
				var i2 = new Number(val) * 0.78
				var i3 = new Number(val) * 6.9
				var binding0 = _this.elementBindings[0]
				var binding2 = _this.elementBindings[2]
				var binding3 = _this.elementBindings[3]
				binding0.element[binding0.attribute] = i1
				binding2.element[binding2.attribute] = i2
				binding3.element[binding3.attribute] = i3
				break;
			case 2:
				_this.value = val

				var i1 = new Number(val) * 1.14
				var i2 = new Number(val) * 1.27
				var i3 = new Number(val) * 8.83
				var binding0 = _this.elementBindings[0]
				var binding1 = _this.elementBindings[1]
				var binding3 = _this.elementBindings[3]
				binding0.element[binding0.attribute] = i1
				binding1.element[binding1.attribute] = i2
				binding3.element[binding3.attribute] = i3
				break;
			case 3:
				_this.value = val

				var i1 = new Number(val) * 0.13
				var i2 = new Number(val) * 0.11
				var i3 = new Number(val) * 0.14
				var binding0 = _this.elementBindings[0]
				var binding1 = _this.elementBindings[1]
				var binding2 = _this.elementBindings[2]
				binding0.element[binding0.attribute] = i1
				binding1.element[binding1.attribute] = i2
				binding2.element[binding2.attribute] = i3
				break;
		}
    }
    this.addBinding = function(element, attribute, event,region){
        var binding = {
            element: element,
            attribute: attribute
        }
        if (event){
            element.addEventListener(event, function(event){
                _this.valueSetter(element[attribute],region);
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

var money = 1
var obj = {a:money}
var myInputElement1 = document.getElementById("euro")
var myInputElement2 = document.getElementById("dollar")
var myInputElement3 = document.getElementById("pound")
var myInputElement4 = document.getElementById("rmb")

new Binding({
	object: obj,
	property: "a"
})
.addBinding(myInputElement1, "value", "keyup",0)
.addBinding(myInputElement2, "value", "keyup",1)
.addBinding(myInputElement3, "value","keyup",2)
.addBinding(myInputElement4, "value","keyup",3)

