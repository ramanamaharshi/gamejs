(function(){
return;
	
	
	
	
	window.oWorld = window.oWorld || {};
	
	
	
	
	window.Unit = function (oWorld, nR) {
		
		var oU = this;
		
		oU.oWorld = oWorld;
		oU.nR = nR;
		
		oU.aLands = [];
		
	};
	
	
	
	
	Unit.vSetXY = function (nX, nY) {
		
		var oU = this;
		
		oU.nX = nX;
		oU.nY = nY;
		
		oU.aLands.forEach(function(oLand){
			bRemoveFromArray(oLand.aUnits, oU);
		});
		oU.aLands = oWorld.oLands.aGetInRect(
			oU.nX - oU.nR,
			oU.nY - oU.nR,
			oU.nX + oU.nR,
			oU.nY + oU.nR
		);
		
		oU.aLands.forEach(function(oLand){
			oLand.aUnits.push(oU);
		});
		
	};
	
	
	
	
})();