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
				oI.aJustPressedKeys.push(iKey);
				if (oI.bLog) console.log('key', iKey);
			}
		}, false);
		addEventListener("keyup", function(oEvent){
			var iKey = oEvent.keyCode;
			if (iKey in oI.oPressedKeys) {
				delete oI.oPressedKeys[iKey];
				oI.aJustReleasedKeys.push(iKey);
			}
		}, false);
		
		oI.iMouseCorrectionX = 0;
		oI.iMouseCorrectionY = 0;
		
		oI.oMouse = {iX: 0, iY: 0};
		oI.oMouse.oPressedButtons = {};
		oI.oMouse.aJustPressedButtons = [];
		oI.oMouse.aJustReleasedButtons = [];
		
		oCanvas.addEventListener('mousemove', function(oEvent){
			var oCanvasOffset = oI.oGetCanvasOffset();
			oI.oMouse.iX = oI.iMouseCorrectionX - oCanvasOffset.iX + oEvent.clientX;
			oI.oMouse.iY = oI.iMouseCorrectionY - oCanvasOffset.iY + oEvent.clientY;
		});
		oCanvas.addEventListener('mousedown', function(oEvent){
			var iButton = oEvent.button;
			if (!(iButton in oI.oMouse.oPressedButtons)) {
				oI.oMouse.oPressedButtons[iButton] = true;
				oI.oMouse.aJustPressedButtons.push(iButton);
				if (oI.bLog) console.log('button', iButton);
			}
		});
		oCanvas.addEventListener('mouseup', function(oEvent){
			var iButton = oEvent.button;
			if (iButton in oI.oMouse.oPressedButtons) {
				delete oI.oMouse.oPressedButtons[iButton];
				oI.oMouse.aJustReleasedButtons.push(iButton);
			}
		});
		
	};
	
	
	
	
	Input.prototype.bMouseCapturingActivated = false;
	Input.prototype.vActivateMouseCapturing = function (fOnChange) {
		
		var oI = this;
		
		if (oI.bMouseCapturingActivated) return;
		oI.bMouseCapturingActivated = true;
		
		var oE = oI.oCanvas;
		
		var sEnvironment = false;
		var sPrependEnvironment = function (sEnv, sString) {
			var sString = sEnv + sString;
			sString = sString.charAt(0).toLowerCase() + sString.slice(1);
			return sString;
		};
		['', 'moz', 'webkit'].forEach(function(sEnv){
			if (typeof oE[sPrependEnvironment(sEnv, 'RequestPointerLock')] === 'function') {
				sEnvironment = sEnv;
			}
		});
		
		var sFunction = sPrependEnvironment(sEnvironment, 'RequestPointerLock');
		var sElement = sPrependEnvironment(sEnvironment, 'PointerLockElement');
		var sEvent = sPrependEnvironment(sEnvironment, 'pointerlockchange');
		
		var bCaptured = false;
		document.addEventListener(sEvent, function(oEvent){
			var bCapturedNew = document[sElement] == oE;
			if (bCapturedNew != bCaptured) {
				fOnChange(bCapturedNew, oE);
			}
			bCaptured = bCapturedNew;
		}, false);
		
		oE.addEventListener('click', function(oEvent){
			oE.vPointerLock = oE[sFunction];
			oE.vPointerLock();
		});
		
	};
	
	
	
	
	Input.prototype.oGetCanvasOffset = function () {
		
		var oI = this;
		
		var oOffset = {};
		
		var oRect = oI.oCanvas.getBoundingClientRect();
		var oComputedStyle = window.getComputedStyle(oI.oCanvas, null);
		
		var iBorderLeft = parseInt(oComputedStyle.getPropertyValue('border-left-width'), 10);
		var iBorderTop = parseInt(oComputedStyle.getPropertyValue('border-top-width'), 10);
		
		oOffset.iX = oRect.left + iBorderLeft;
		oOffset.iY = oRect.top + iBorderTop;
		
		return oOffset;
		
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
