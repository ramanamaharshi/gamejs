(function(){
	
	
	
	
	window.Camera = function () {
		
		var oC = this;
		
		oC.nZoom = 1;
		oC.nViewCenterX = 0;
		oC.nViewCenterY = 0;
		oC.nDrawX = 0;
		oC.nDrawY = 0;
		oC.nDrawW = 0;
		oC.nDrawH = 0;
		
		oC.vUpdate();
		
	};
	
	
	
	
	Camera.prototype.pCanvasToWorld = function (pCanvasPos) {
		
		var oC = this;
		
		return [
			(pCanvasPos[0] - oC.nPlusX) / oC.nZoom,
			(pCanvasPos[1] - oC.nPlusY) / oC.nZoom,
		];
		
	};
	
	
	
	
	Camera.prototype.pWorldToCanvas = function (pWorldPos) {
		
		var oC = this;
		
		return [
			oC.nPlusX + oC.nZoom * pWorldPos[0],
			oC.nPlusY + oC.nZoom * pWorldPos[1],
		];
		
	};
	
	
	
	
	Camera.prototype.vZoom = function (nDoublings, pPosition) {
		
		var oC = this;
		
		var pPosInWorldBefore = oC.pCanvasToWorld(pPosition);
		oC.vSetZoom(oC.nZoom * Math.pow(2, nDoublings));
		var pPosInWorldAfter = oC.pCanvasToWorld(pPosition);
		var nNewViewCenterX = oC.nViewCenterX - (pPosInWorldAfter[0] - pPosInWorldBefore[0]);
		var nNewViewCenterY = oC.nViewCenterY - (pPosInWorldAfter[1] - pPosInWorldBefore[1]);
		oC.vSetViewCenter(nNewViewCenterX, nNewViewCenterY);
		
	};
	
	
	
	
	Camera.prototype.vSetZoom = function (nZoom) {
		
		var oC = this;
		
		oC.nZoom = nZoom;
		
		oC.vUpdate();
		
	};
	
	
	
	
	Camera.prototype.vSetViewCenter = function (nViewCenterX, nViewCenterY) {
		
		var oC = this;
		
		oC.nViewCenterX = nViewCenterX;
		oC.nViewCenterY = nViewCenterY;
		
		oC.vUpdate();
		
	};
	
	
	
	
	Camera.prototype.vSetDrawRect = function (nDrawX, nDrawY, nDrawW, nDrawH) {
		
		var oC = this;
		
		oC.nDrawX = nDrawX;
		oC.nDrawY = nDrawY;
		oC.nDrawW = nDrawW;
		oC.nDrawH = nDrawH;
		
		oC.vUpdate();
		
	};
	
	
	
	
	Camera.prototype.vUpdate = function () {
		
		var oC = this;
		
		oC.nPlusX = oC.nDrawX - oC.nZoom * oC.nViewCenterX + oC.nDrawW / 2;
		oC.nPlusY = oC.nDrawY - oC.nZoom * oC.nViewCenterY + oC.nDrawH / 2;
		
	};
	
	
	
	
})();