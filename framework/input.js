(function(){
	
	
	
	
	var Input = function (oCanvas) {
		
		var oI = this;
		
		oI.bLog = false;
		oI.oCanvas = oCanvas;
		
		oI.oPressedKeys = {};
		oI.aJustPressedKeys = [];
		oI.aJustReleasedKeys = [];
		
		addEventListener("keydown", function(oEvent){
			var iKey = oEvent.keyCode;
			if (!(iKey in oI.oPressedKeys)) {
				oI.oPressedKeys[iKey] = true;
				if (oI.bLog) console.log(iKey);
				oI.aJustPressedKeys.push(iKey);
			}
		}, false);
		addEventListener("keyup", function(oEvent){
			var iKey = oEvent.keyCode;
			if (iKey in oI.oPressedKeys) {
				delete oI.oPressedKeys[iKey];
				oI.aJustReleasedKeys.push(iKey);
			}
		}, false);
		
		oI.oMouse = {iX: 0, iY: 0};
		oI.oMouse.oPressedButtons = {};
		oI.oMouse.aJustPressedButtons = [];
		oI.oMouse.aJustReleasedButtons = [];
		
		oCanvas.addEventListener('mousemove', function(oEvent){
			var oRect = oI.oCanvas.getBoundingClientRect();
			oI.oMouse.iX = oEvent.clientX - oRect.left;
			oI.oMouse.iY = oEvent.clientY - oRect.top;
		});
		oCanvas.addEventListener('mousedown', function(oEvent){
			var iButton = oEvent.button;
			if (!(iButton in oI.oMouse.oPressedButtons)) {
				oI.oMouse.oPressedButtons[iButton] = true;
				oI.oMouse.aJustPressedButtons.push(iButton);
			}
		});
		oCanvas.addEventListener('mouseup', function(oEvent){
			if (iButton in oI.oMouse.oPressedButtons) {
				var iButton = oEvent.button;
				delete oI.oMouse.oPressedButtons[iButton];
				oI.oMouse.aJustRelasedButtons.push(iButton);
			}
		});
		
	};
	
	
	
	
	Input.prototype.bKey = function (iKey) {
		
		return (iKey in this.oPressedKeys);
		
	};
	
	
	
	
	Input.prototype.bButton = function (iButton) {
		
		return (iKey in this.oMouse.oPressedButtons);
		
	};
	
	
	
	
	Input.prototype.iKeyJustPressed = function (iKey) {
		
		return this.iCountJust(iKey, this.aJustPressedKeys);
		
	};
	
	
	
	
	Input.prototype.iKeyJustReleased = function (iKey) {
		
		return this.iCountJust(iKey, this.aJustReleasedKeys);
		
	};
	
	
	
	
	Input.prototype.iButtonJustPressed = function (iButton) {
		
		return this.iCountJust(iButton, this.oMouse.aJustPressedButtons);
		
	};
	
	
	
	
	Input.prototype.iButtonJustReleased = function (iButton) {
		
		return this.iCountJust(iButton, this.oMouse.aJustReleasedButtons);
		
	};
	
	
	
	
	Input.prototype.iCountJust = function (iItem, aJust) {
		
		var iReturn = 0;
		
		for (var iJ = 0; iJ < aJust.length; iJ ++) {
			if (aJust[iJ] == iItem) iReturn ++;
		}
		
		return iReturn;
		
	};
	
	
	
	
	Input.prototype.vStep = function () {
		
		var oI = this;
		oI.aJustPressedKeys = [];
		oI.aJustReleasedKeys = [];
		oI.oMouse.aJustPressedButtons = [];
		oI.oMouse.aJustReleasedButtons = [];
		
	};
	
	
	
	
	window.Input = Input;
	
	
	
	
})();
