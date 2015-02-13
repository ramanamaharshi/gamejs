(function(){
	
	
	
	
	var Input = function (oCanvas) {
		
		var oI = this;
		
		oI.bLog = false;
		oI.oCanvas = oCanvas;
		
		oI.bMouseCaptured = false;
		oI.bMouseCapturingActivated = false;
		
		oI.vInitKeyListeners();
		oI.vInitMouseListeners();
		
	};
	
	
	
	
	Input.prototype.vActivateMouseCapturing = function (fOnChange) {
		
		var oI = this;
		
		if (oI.bMouseCapturingActivated) return;
		oI.bMouseCapturingActivated = true;
		
		var oE = oI.oCanvas;
		
		oI.sPointerLockEnvironment = false;
		var sPrependEnv = function (sString, sEnvironment) {
			if (typeof sEnvironment == 'undefined') {
				sEnvironment = oI.sPointerLockEnvironment;
			}
			var sString = sEnvironment + sString;
			sString = sString.charAt(0).toLowerCase() + sString.slice(1);
			return sString;
		};
		['', 'moz', 'webkit'].forEach(function(sEnv){
			if (typeof oE[sPrependEnv('RequestPointerLock', sEnv)] === 'function') {
				oI.sPointerLockEnvironment = sEnv;
			}
		});
		
		oI.oPointerLock = {};
		
		oI.oPointerLock.sRequest = sPrependEnv('RequestPointerLock');
		oI.oPointerLock.sElement = sPrependEnv('PointerLockElement');
		oI.oPointerLock.sOnChange = sPrependEnv('pointerlockchange');
		oI.oPointerLock.sMovementX = sPrependEnv('MovementX');
		oI.oPointerLock.sMovementY = sPrependEnv('MovementY');
		
		document.addEventListener(oI.oPointerLock.sOnChange, function(oEvent){
			var bCaptured = document[oI.oPointerLock.sElement] == oE;
			if (bCaptured != oI.bMouseCaptured) {
				oI.bMouseCaptured = bCaptured;
				fOnChange(bCaptured, oE);
			}
		}, false);
		
		oE.addEventListener('click', function(oEvent){
			oE.vPointerLock = oE[oI.oPointerLock.sRequest];
			oE.vPointerLock();
		});
		
	};
	
	
	
	
	Input.prototype.vInitKeyListeners = function () {
		
		var oI = this;
		
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
		
	};
	
	
	
	
	Input.prototype.vInitMouseListeners = function () {
		
		var oI = this;
		
		oI.iMouseCorrectionX = 0;
		oI.iMouseCorrectionY = 0;
		
		oI.oMouse = {iX: 0, iY: 0};
		oI.oMouseMoved = {iX: 0, iY: 0};
		oI.oMouse.oPressedButtons = {};
		oI.oMouse.aJustPressedButtons = [];
		oI.oMouse.aJustReleasedButtons = [];
		
		oI.oCanvas.addEventListener('mousemove', function(oEvent){
			var oCanvasOffset = oI.oGetCanvasOffset();
			var iNewMouseX = oI.iMouseCorrectionX - oCanvasOffset.iX + oEvent.clientX;
			var iNewMouseY = oI.iMouseCorrectionY - oCanvasOffset.iY + oEvent.clientY;
			if (oI.bMouseCaptured) {
				oI.oMouseMoved.iX += oEvent[oI.oPointerLock.sMovementX];
				oI.oMouseMoved.iY += oEvent[oI.oPointerLock.sMovementY];
			} else {
				oI.oMouseMoved.iX += iNewMouseX - oI.oMouse.iX;
				oI.oMouseMoved.iY += iNewMouseY - oI.oMouse.iY;
			}
			oI.oMouse.iX = iNewMouseX;
			oI.oMouse.iY = iNewMouseY;
		});
		oI.oCanvas.addEventListener('mousedown', function(oEvent){
			var iButton = oEvent.button;
			if (!(iButton in oI.oMouse.oPressedButtons)) {
				oI.oMouse.oPressedButtons[iButton] = true;
				oI.oMouse.aJustPressedButtons.push(iButton);
				if (oI.bLog) console.log('button', iButton);
			}
		});
		oI.oCanvas.addEventListener('mouseup', function(oEvent){
			var iButton = oEvent.button;
			if (iButton in oI.oMouse.oPressedButtons) {
				delete oI.oMouse.oPressedButtons[iButton];
				oI.oMouse.aJustReleasedButtons.push(iButton);
			}
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
		
		oI.oMouseMoved.iX = 0;
		oI.oMouseMoved.iY = 0;
		
		oI.aJustPressedKeys = [];
		oI.aJustReleasedKeys = [];
		
		oI.oMouse.aJustPressedButtons = [];
		oI.oMouse.aJustReleasedButtons = [];
		
	};
	
	
	
	
	window.Input = Input;
	
	
	
	
})();
