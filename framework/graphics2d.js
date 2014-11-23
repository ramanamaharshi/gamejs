(function(){
	
	
	
	
	var Graphics2D = function (iW, iH) {
		
		var oG = this;
		
		oG.oCanvas = document.createElement('canvas');
		oG.oCanvas.style.border = '1px solid #ccc';
		oG.oCanvas.style.position = 'relative';
		oG.oCanvas.style.left = '10px';
		oG.oCanvas.style.top = '10px';
		document.body.appendChild(oG.oCanvas);
		oG.o2D = oG.oCanvas.getContext("2d");
		
		oG.vSetBounds(iW, iH);
		
	};
	
	
	
	
	Graphics2D.prototype.oGetCanvas = function () {
		
		return this.oCanvas;
		
	};
	
	
	
	
	Graphics2D.prototype.vSetBounds = function (iW, iH) {
		
		var oG = this;
		
		oG.iWidth = iW;
		oG.iHeight = iH;
		
		oG.oCanvas.width = iW;
		oG.oCanvas.height = iH;
		
	};
	
	
	
	
	Graphics2D.prototype.oLoadImage = function (sSrc, vCallback) {
		
		var oG = this;
		
		var oImage = new Image();
		oImage.bReady = true;
		oImage.onload = function () {
			oImage.bReady = true;
			if (typeof vCallback == 'function') vCallback();
		}
		oImage.src = sSrc;
		
		return oImage;
		
	};
	
	
	
	
	Graphics2D.prototype.vFillCircle = function (iX, iY, iR) {
		
		var oG = this;
		oG.vDrawCircle(iX, iY, iR, iR);
		oG.o2D.fill();
		
	};
	
	
	
	
	Graphics2D.prototype.vDrawCircle = function (iX, iY, iR) {
		
		this.vDrawOvalByCenterAndRadius(iX, iY, iR, iR);
		
	};
	
	
	
	
	Graphics2D.prototype.vFillOval = function (iX, iY, iW, iH) {
		
		var oG = this;
		oG.vDrawOval(iX, iY, iW, iH);
		oG.o2D.fill();
		
	};
	
	
	
	
	Graphics2D.prototype.vDrawOval = function (iX, iY, iW, iH) {
		
		var oG = this;
		
		oG.vDrawOvalByCenterAndRadius(iX + iW / 2, iY + iH / 2, iW / 2, iH / 2);
		
	};
	
	
	
	
	Graphics2D.prototype.vDrawOvalByCenterAndRadius = function (iCX, iCY, iRX, iRY) {
		
		var oG = this;
		var oC = oG.o2D;
		
		oC.save();
		oC.beginPath();
		oC.translate(iCX - iRX, iCY - iRY);
		oC.scale(iRX, iRY);
		oC.arc(1, 1, 1, 0, 2 * Math.PI, false);
		oC.restore();
		oC.stroke();
		
	};
	
	
	
	
	Graphics2D.prototype.vFillRect = function (iX, iY, iW, iH) {
		this.o2D.fillRect(iX, iY, iW, iH);
	};
	
	
	
	
	Graphics2D.prototype.vDrawLine = function (iXA, iYA, iXB, iYB, iStroke) {
		var o2D = this.o2D;
		if (typeof iStroke == 'undefined') iStroke = 1;
		o2D.beginPath();
		o2D.moveTo(iXA, iYA);
		o2D.lineTo(iXB, iYB);
		o2D.stroke();
	};
	
	
	
	
	Graphics2D.prototype.vDrawImage = function (oImage, iX, iY) {
		this.o2D.drawImage(oImage, iX, iY);
	};
	
	
	
	
	Graphics2D.prototype.vSetColor = function (sColor) {
		this.o2D.strokeStyle = sColor;
		this.o2D.fillStyle = sColor;
	};
	
	
	
	
	window.Graphics2D = Graphics2D;
	
	
	
	
})();