(function(){
	
	
	
	
	var Input = function () {
		
		var oI = this;
		
		oI.aPressedKeys = {};
		addEventListener("keydown", function(oEvent){oI.aPressedKeys[oEvent.keyCode] = true;}, false);
		addEventListener("keyup", function(oEvent){delete oI.aPressedKeys[oEvent.keyCode];}, false);
		
	};
	
	
	
	
	Input.prototype.bKeyDown = function (sKeyCode) {
		
		var oI = this;
		
		var bReturn = sKeyCode in oI.aPressedKeys;
		
		return bReturn;
		
	};
	
	
	
	
	window.Input = Input;
	
	
	
	
})();
