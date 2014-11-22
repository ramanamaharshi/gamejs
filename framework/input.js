(function(){
	
	
	
	
	var Input = function () {
		
		var oI = this;
		
		oI.bLog = false;
		
		oI.oPressedKeys = {};
		addEventListener("keydown", function(oEvent){
			if (!(oEvent.keyCode in oI.oPressedKeys)) {
				oI.oPressedKeys[oEvent.keyCode] = true;
				if (oI.bLog) {
					console.log(oEvent.keyCode);
				}
			}
		}, false);
		addEventListener("keyup", function(oEvent){
			delete oI.oPressedKeys[oEvent.keyCode];
		}, false);
		
	};
	
	
	
	
	Input.prototype.bKey = function (iKey) {
		
		var bReturn = false;
		
		for (var iA = 0; iA < arguments.length; iA ++) {
			if (arguments[iA] in this.oPressedKeys) {
				bReturn = true;
				break;
			}
		}
		
		return bReturn;
		
	};
	
	
	
	
	window.Input = Input;
	
	
	
	
})();
