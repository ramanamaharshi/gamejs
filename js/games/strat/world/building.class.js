(function(){
return;
	
	
	
	
	window.oWorld = window.oWorld || {};
	
	
	
	
	window.Building = function (oWorld, iLandX, iLandY, iLandW, iLandH) {
		
		var oB = this;
		
		oWorld.oBuildings.aBuildings.push(oB);
		
		oB.oWorld = oWorld;
		oB.iLandX = iLandX;
		oB.iLandY = iLandY;
		oB.iLandW = iLandW;
		oB.iLandH = iLandH;
		
		oB.aLands = [];
		for (var iLPX = o; iLPX < oB.iLandW; iLPX ++) {
			for (var iLPY = o; iLPY < oB.iLandH; iLPY ++) {
				var oLand = oWorld.oLands.oGet(oB.iLandX + iLPX, oB.iLandY + iLPY);
				oLand.oBuilding = oB;
				oB.aLands.push(oLand);
			}
		}
		
	};
	
	
	
	
	Building.prototype.vRemove = function () {
		
		var oB = this;
		
		bRemoveFromArray(oWorld.oBuildings.aBuildings, oB);
		
		oB.aLands.forEach(function(oLand){
			oLand.oBuilding = null;
		});
		
	};
	
	
	
	
})();