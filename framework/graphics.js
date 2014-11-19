(function(){
	
	
	
	
	var Graphics = function (iW, iH) {
		
		var oG = this;
		
		oG.oCanvas = document.createElement('canvas');
		document.body.appendChild(oG.oCanvas);
		oG.o2D = oG.oCanvas.getContext("2d");
		
		oG.vSetBounds(iW, iH);
		
	};
	
	
	
	
	Graphics.prototype.vSetBounds = function (iW, iH) {
		
		var oG = this;
		
		oG.iWidth = iW;
		oG.iHeight = iH;
		
		oG.oCanvas.width = iW;
		oG.oCanvas.height = iH;
		
	};
	
	
	
	
	Graphics.prototype.oLoadImage = function (sSrc, vCallback) {
		
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
	
	
	
	
	Graphics.prototype.vFillOval = function (iX, iY, iW, iH) {
		
		var oG = this;
		
		oG.vDrawOvalByCenterAndRadius(iX + iW / 2, iY + iH / 2, iW / 2, iH / 2);
		
	};
	
	
	
	
	Graphics.prototype.vDrawOvalByCenterAndRadius = function (iCX, iCY, iRX, iRY) {
		
		var oG = this;
		var oC = oG.o2D;
		
		oC.save();
		oC.beginPath();
		oC.translate(iCX - iRX, iCY - iRY);
		oC.scale(iRX, iRY);
		oC.arc(1, 1, 1, 0, 2 * Math.PI, false);
		oC.restore();
		oC.fill();
		
	};
	
	
	
	
	Graphics.prototype.vFillRect = function (iX, iY, iW, iH) {
		this.o2D.fillRect(iX, iY, iW, iH);
	};
	
	
	
	
	Graphics.prototype.vDrawImage = function (oImage, iX, iY) {
		this.o2D.drawImage(oImage, iX, iY);
	};
	
	
	
	
	Graphics.prototype.vSetColor = function (sColor) {
		this.o2D.drawStyle = sColor;
		this.o2D.fillStyle = sColor;
	};
	
	
	
	
	window.Graphics = Graphics;
	
	
	
	
})();