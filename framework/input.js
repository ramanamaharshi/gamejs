(function(){
	
	
	
	
	var Input = function (oCanvas) {
		
		var oI = this;
		
		oI.bLog = false;
		oI.oCanvas = oCanvas;
		
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
		
		oI.oMouse = {iX: 0, iY: 0, oPressedButtons: {}};
		oCanvas.addEventListener('mousemove', function(oEvent){
			var oRect = oI.oCanvas.getBoundingClientRect();
			oI.oMouse.iX = oEvent.clientX - oRect.left;
			oI.oMouse.iY = oEvent.clientY - oRect.top;
		});
		oCanvas.addEventListener('mousedown', function(oEvent){
			oI.oMouse.oPressedButtons[oEvent.button] = true;
		});
		oCanvas.addEventListener('mouseup', function(oEvent){
			delete oI.oMouse.oPressedButtons[oEvent.button];
		});
		
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
