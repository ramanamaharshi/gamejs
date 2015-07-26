(function(){
	
	
	
	
	window.oWorld = window.oWorld || {};
	
	
	
	
	oWorld.vInit = function (iW, iH) {
		
		oWorld.iW = iW;
		oWorld.iH = iH;
		
		oWorld.oPlayers = {aPlayers: []};
		oWorld.oBuildings = {aBuildings: []};
		oWorld.oUnits = {aUnits: []};
		
	};
	
	
	
	
	oWorld.vDraw = function (oG, oCamera) {
		
		//oWorld.oLands.vDraw(oG.oCamera);
		
	};
	
	
	
	
	var bRemoveFromArray = function (aArray, mElement) {
		
		for (var iE = 0; iE < aArray.length; iE ++) {
			if (aArray[iE] === mElement) {
				aArray.splice(iE, 1);
			}
		}
		
		return false;
		
	};
	
	
	
	
})();