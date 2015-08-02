(function(){
	
	
	
	
	window.Land = function (oWorld, iX, iY) {
		
		var oL = this;
		
		oL.oWorld = oWorld;
		oL.iX = iX;
		oL.iY = iY;
		
		oL.oBuilding = null;
		oL.aUnits = [];
		
	};
	
	
	
	
	Land.prototype.oGetNeighbor = function (iRelX, iRelY) {
		
		var oL = this;
		
		oWorld.oLands.oGet(oL.iX + iRelX, oL.iY + iRelY);
		
	};
	
	
	
	
	window.oWorld = window.oWorld || {};
	
	oWorld.oLands = {
		
		
		aLands: [],
		
		
		vInit: function () {
			
			var oLands = this;
			
			for (var iY = 0; iY < iH; iY ++) {
				for (var iX = 0; iX < iW; iX ++) {
					oLands.aLands.push(new Land(oWorld, iX, iY));
				}
			}
			
		},
		
		
		oGet: function (iX, iY) {
			
			return this.aLands[iY * iW + iX];
			
		},
		
		
		oGetAt: function (nX, nY) {
			
			return this.oGet(Math.floor(nX), Math.floor(nY));
			
		},
		
		
		aGetInRect: function (nVonX, nVonY, nBisX, nBisY) {
			
			var oLands = this;
			
			var iVonX = Math.floor(nVonX);
			var iVonY = Math.floor(nVonY);
			var iBisX = Math.floor(nBisX);
			var iBisY = Math.floor(nBisY);
			
			var aReturn = [];
			
			for (var iY = iVonY; iY < iBisY; iY ++) {
				for (var iX = iVonX; iX < iBisX; iX ++) {
					aReturn.push(oLands.oGet(iX, iY));
				}
			}
			
			return aReturn;
			
		},
		
		
	};
	
	
	
	
})();