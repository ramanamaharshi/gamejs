(function(){
	
	
	
	
	window.Graphics2D = function (oCanvas) {
		
		var oG = this;
		
		oG.oCanvas = oCanvas;
		
		oG.o2D = oG.oCanvas.getContext("2d");
oG.o2D.imageSmoothingEnabled = false;
		
		oG.iDrawShift = 0;
		
	};
	
	
	
	
	Graphics2D.oCreateBuffer = function (iW, iH, sBackgroundColor) {
		
		var oBufferImage = document.createElement('canvas');
		var oBufferGraphics = new Graphics2D(oBufferImage);
		oBufferImage.width = iW;
		oBufferImage.height = iH;
		
		if (sBackgroundColor) {
			oBufferGraphics.o2D.fillStyle = sBackgroundColor;
			oBufferGraphics.o2D.fillRect(0, 0, iW, iH);
		}
		
		return oBufferGraphics;
		
	};
	
	
	
	
	Graphics2D.prototype.oLoadImage = function (sSrc, vCallback) {
		
		var oG = this;
		
		var oImage = new Image();
		oImage.bReady = true;
		oImage.onload = function () {
			oImage.bReady = true;
			if (typeof vCallback == 'function') vCallback(oImage);
		}
		oImage.src = sSrc;
		
		return oImage;
		
	};
	
	
	
	
	Graphics2D.prototype.vDrawString = function (iX, iY, sString, sPosition) {
		
		var oG = this;
		
		if (typeof sPosition != 'undefined') {
			var iTextW = oG.o2D.measureText(sString).width;
			var iTextH = 1.5 * oG.o2D.measureText('o').width;
			var aPosition = sPosition.split(' ');
			if (aPosition[0] == 'left') {
				iX -= iTextW;
			}
			if (aPosition[0] == 'center') {
				iX -= iTextW / 2;
			}
			if (aPosition[1] == 'center') {
				iY += iTextH / 2;
			}
			if (aPosition[1] == 'bottom') {
				iY += iTextH;
			}
		}
		
		this.o2D.fillText(sString, iX, iY);
		
	};
	
	
	
	
	Graphics2D.prototype.vDrawCircle = function (iX, iY, iR) {
		this.vCircle(iX, iY, iR);
		this.o2D.stroke();
	};
	Graphics2D.prototype.vFillCircle = function (iX, iY, iR) {
		this.vCircle(iX, iY, iR);
		this.o2D.fill();
	};
	Graphics2D.prototype.vCircle = function (iX, iY, iR) {
		if (typeof iX == 'object') {
			iR = iY; iY = iX[1]; iX = iX[0];
		}
		this.vOvalByCenterAndRadius(iX, iY, iR, iR);
	};
	
	
	
	
	Graphics2D.prototype.vDrawOval = function (iX, iY, iW, iH) {
		this.vOval(iX, iY, iW, iH);
		this.o2D.stroke();
	};
	Graphics2D.prototype.vFillOval = function (iX, iY, iW, iH) {
		this.vOval(iX, iY, iW, iH);
		this.o2D.fill();
	};
	Graphics2D.prototype.vOval = function (iX, iY, iW, iH) {
		this.vOvalByCenterAndRadius(iX + iW / 2, iY + iH / 2, iW / 2, iH / 2);
	};
	
	
	
	
	Graphics2D.prototype.vOvalByCenterAndRadius = function (iCX, iCY, iRX, iRY) {
		
		var oG = this;
		var o2D = oG.o2D;
		
		o2D.save();
		o2D.beginPath();
		o2D.translate(iCX + 0.5 - iRX, iCY + 0.5 - iRY);
		o2D.scale(iRX, iRY);
		o2D.arc(1, 1, 1, 0, 2 * Math.PI, false);
		o2D.restore();
		
	};
	
	
	
	
	Graphics2D.prototype.vFillPolygon = function (aP) {
		this.vPolygon(aP);
		this.o2D.fill();
	}
	Graphics2D.prototype.vDrawPolygon = function (aP) {
		this.vPolygon(aP);
		this.o2D.stroke();
	}
	Graphics2D.prototype.vPolygon = function (aP) {
		var oG = this;
		var o2D = oG.o2D;
		o2D.beginPath();
		o2D.moveTo(aP[aP.length - 1][0] + oG.iDrawShift, aP[aP.length - 1][1] + oG.iDrawShift);
		for (var iP = 0; iP < aP.length; iP ++) {
			o2D.lineTo(aP[iP][0] + oG.iDrawShift, aP[iP][1] + oG.iDrawShift);
		}
		o2D.lineTo(aP[0][0] + oG.iDrawShift, aP[0][1] + oG.iDrawShift);
	};
	
	
	
	
	Graphics2D.prototype.vDrawRect = function (iX, iY, iW, iH) {
		this.vDrawPolygon([[iX,iY],[iX,iY+iH],[iX+iW,iY+iH],[iX+iH,iY]]);
	};
	
	
	
	
	Graphics2D.prototype.vFillRect = function (iX, iY, iW, iH) {
		this.o2D.fillRect(iX, iY, iW, iH);
	};
	
	
	
	
	Graphics2D.prototype.vDrawDot = function (nX, nY) {
		if (typeof nX == 'object') { nY = nX[1]; nX = nX[0]; }
		this.vFillRect(nX, nY, 1, 1);
	};
	
	
	
	
	Graphics2D.prototype.vDrawLine = function (nAX, nAY, nBX, nBY) {
		if (typeof nAX == 'object' && typeof nAY == 'object') {
			nBY = nAY[1]; nBX = nAY[0]; nAY = nAX[1]; nAX = nAX[0];
		}
		var o2D = this.o2D;
		o2D.beginPath();
		o2D.moveTo(nAX + oG.iDrawShift, nAY + oG.iDrawShift);
		o2D.lineTo(nBX + oG.iDrawShift, nBY + oG.iDrawShift);
		o2D.stroke();
	};
	
	
	
	
	Graphics2D.prototype.vDrawBuffer = function (oBuffer, iX, iY, iW, iH, bSmoothing) {
		return this.vDrawImage(oBuffer.oCanvas, iX, iY, iW, iH, bSmoothing);
	};
	Graphics2D.prototype.vDrawImage = function (oImage, iX, iY, iW, iH, bSmoothing) {
		this.vSetImageSmoothing(bSmoothing);
		if (typeof iW == 'undefined') iW = oImage.width;
		if (typeof iH == 'undefined') iH = oImage.width;
		this.o2D.drawImage(oImage, 0, 0, oImage.width, oImage.height, iX, iY, iW, iH);
	};
	
	
	
	
	Graphics2D.prototype.vSetImageSmoothing = function (bSmoothing) {
		
		this.o2D.imageSmoothingEnabled = bSmoothing;
		this.o2D.msImageSmoothingEnabled = bSmoothing;
		this.o2D.mozImageSmoothingEnabled = bSmoothing;
		this.o2D.webkitImageSmoothingEnabled = bSmoothing;
		
	};
	
	
	
	
	Graphics2D.prototype.vSetColor = function (sColor) {
		this.o2D.strokeStyle = sColor;
		this.o2D.fillStyle = sColor;
	};
	
	
	
	
	Graphics2D.prototype.vSetFont = function (sFont) {
		this.o2D.font = sFont;
	};
	
	
	
	
	Graphics2D.prototype.iGetW = function () {
		
		return this.oCanvas.width;
		
	};
	
	
	
	
	Graphics2D.prototype.iGetH = function () {
		
		return this.oCanvas.height;
		
	};
	
	
	
	
	Graphics2D.prototype.aGetPixelColor = function (iPixelX, iPixelY) {
		
		return this.o2D.getImageData(iPixelX, iPixelY, 1, 1).data;
		
	};
	
	
	
	
})();
