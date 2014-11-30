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
	
	
	
	
	Graphics2D.prototype.vDrawCircle = function (iX, iY, iR) {
		this.vCircle(iX, iY, iR);
		this.o2D.stroke();
	};
	Graphics2D.prototype.vFillCircle = function (iX, iY, iR) {
		this.vCircle(iX, iY, iR);
		this.o2D.fill();
	};
	Graphics2D.prototype.vCircle = function (iX, iY, iR) {
		if (typeof iX == 'object') iR = iY; iY = iX[1]; iX = iX[0];
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
		o2D.translate(iCX - iRX, iCY - iRY);
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
		var o2D = this.o2D;
		o2D.beginPath();
		o2D.moveTo(aP[aP.length - 1][0], aP[aP.length - 1][1]);
		for (var iP = 0; iP < aP.length; iP ++) {
			o2D.lineTo(aP[iP][0], aP[iP][1]);
		}
	};
	
	
	
	
	Graphics2D.prototype.vFillRect = function (iX, iY, iW, iH) {
		this.o2D.fillRect(iX, iY, iW, iH);
	};
	
	
	
	
	Graphics2D.prototype.vDrawDot = function (nX, nY) {
		if (typeof nX == 'object') nY = nX[1]; nX = nX[0];
		this.vFillRect(nX, nY, 1, 1);
	};
	
	
	
	
	Graphics2D.prototype.vDrawLine = function (nAX, nAY, nBX, nBY) {
		if (typeof nAX == 'object' && typeof nAY == 'object') {
			nBY = nAY[1]; nBX = nAY[0]; nAY = nAX[1]; nAX = nAX[0];
		}
		var o2D = this.o2D;
		o2D.beginPath();
		o2D.moveTo(nAX, nAY);
		o2D.lineTo(nBX, nBY);
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