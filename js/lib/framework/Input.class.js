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
	
	
	
	
	Input.prototype.oGetMousePos = function () {
		
		return this.oMouse.oPos;
		
	};
	
	
	
	
	Input.prototype.oGetMousePrev = function () {
		
		return this.oMouse.oPrev;
		
	};
	
	
	
	
	Input.prototype.oGetMouseMoved = function () {
		
		return this.oMouse.oMoved;
		
	};
	
	
	
	
	Input.prototype.vActivateMouseCapturing = function (fOnChange) {
		
		var oI = this;
		
		if (typeof fOnChange != 'function') fOnChange = function(){};
		
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
		
		oI.oMouse = {};
		oI.oMouse.oPos = {iX: 0, iY: 0};
		oI.oMouse.oPrev = {iX: 0, iY: 0};
		oI.oMouse.oMoved = {iX: 0, iY: 0};
		oI.oMouse.oPressedButtons = {};
		oI.oMouse.aJustPressedButtons = [];
		oI.oMouse.aJustReleasedButtons = [];
		oI.oMouse.iJustWheel = 0;
		
		oI.oCanvas.addEventListener('mousemove', function(oEvent){
			var oCanvasOffset = oI.oGetCanvasOffset();
			var iNewMouseX = oI.iMouseCorrectionX - oCanvasOffset.iX + oEvent.clientX;
			var iNewMouseY = oI.iMouseCorrectionY - oCanvasOffset.iY + oEvent.clientY;
			if (oI.bMouseCaptured) {
				oI.oMouse.oMoved.iX += oEvent[oI.oPointerLock.sMovementX];
				oI.oMouse.oMoved.iY += oEvent[oI.oPointerLock.sMovementY];
			} else {
				oI.oMouse.oMoved.iX += iNewMouseX - oI.oMouse.oPos.iX;
				oI.oMouse.oMoved.iY += iNewMouseY - oI.oMouse.oPos.iY;
			}
			oI.oMouse.oPos.iX = iNewMouseX;
			oI.oMouse.oPos.iY = iNewMouseY;
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
		
		var vOnMouseWheel = function (oEvent) {
			var iDelta = Math.max(-1, Math.min(1, (-oEvent.detail || oEvent.wheelDelta)));
			oI.oMouse.iJustWheel += iDelta;
		};
		
		oI.oCanvas.addEventListener('DOMMouseScroll', vOnMouseWheel);
		oI.oCanvas.addEventListener('mousewheel', vOnMouseWheel);
		
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
		
		return (iButton in this.oMouse.oPressedButtons);
		
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
	
	
	
	
	Input.prototype.iJustWheel = function () {
		
		return this.oMouse.iJustWheel;
		
	};
	
	
	
	
	Input.prototype.vStep = function () {
		
		var oI = this;
		
		oI.oMouse.oPrev.iX = oI.oMouse.oPos.iX;
		oI.oMouse.oPrev.iY = oI.oMouse.oPos.iY;
		
		oI.oMouse.oMoved.iX = 0;
		oI.oMouse.oMoved.iY = 0;
		
		oI.aJustPressedKeys = [];
		oI.aJustReleasedKeys = [];
		
		oI.oMouse.aJustPressedButtons = [];
		oI.oMouse.aJustReleasedButtons = [];
		
		oI.oMouse.iJustWheel = 0;
		
	};
	
	
	
	
	window.Input = Input;
	
	
	
	
})();
