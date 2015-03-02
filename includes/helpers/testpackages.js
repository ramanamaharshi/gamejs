



var TestPackages = {
	
	
	
	
	oCoords: function (oG, oParams) {
		
		if (typeof oParams == 'undefined') oParams = {};
		if (typeof oParams.nSize == 'undefined') oParams.nSize = 1;
		
		var aColors = [];
		var aPositions = [];
		//var aDirColors = [[0,0,1],[0,1,0],[1,0,0]];
		for (var iDir = 0; iDir < 3; iDir ++) {
			for (var iCorner = 0; iCorner < 3; iCorner ++) {
				var aPosition = [0,0,0];
				//var aColor = aDirColors[iDir];
				if (iCorner == iDir) {
					aPosition[iCorner] = oParams.nSize;
				} else {
					aPosition[iCorner] = 0.1;
				}
				aPositions.push(aPosition);
				aColors.push([aPosition[2], aPosition[1], aPosition[0]]);
			}
		}
		
		var oReturn = {
			v4Position: aPositions,
			v3Color: aColors,
		};
		
		if (!oParams.bDataOnly) {
			oReturn = oG.oCreateAttributeBufferGroup(oReturn);
		}
		
		return oReturn;
		
	},
	
	
	
	
	oPointer: function (oG, oParams) {
		
		if (typeof oParams == 'undefined') oParams = {};
		if (typeof oParams.pDir == 'undefined') oParams.pDir = [0,0,1];
		if (typeof oParams.nLength == 'undefined') oParams.nLength = 1;
		if (typeof oParams.nRadius == 'undefined') oParams.nRadius = oParams.nLength * 0.05;
		if (typeof oParams.aColor == 'undefined') oParams.aColor = [1,1,1];
		if (typeof oParams.aColorBottom == 'undefined') oParams.aColorBottom = [0,0,0];
		if (typeof oParams.iBasePoints == 'undefined') oParams.iBasePoints = 5;
		
		oParams.pDir = Math3D.pNormalize(oParams.pDir);
		
		var pTip = Math3D.pNxP(oParams.nLength, oParams.pDir);
		
		var aOrthos = Math3D.aMakeOrthogonals(oParams.pDir);
		
		var aBasePoints = [];
		for (var iP = 0; iP < oParams.iBasePoints; iP ++) {
			var nRadient = (2 * Math.PI / oParams.iBasePoints) * iP;
			var pPoint = new Float32Array([0,0,0]);
			pPoint = Math3D.pAdd(pPoint, Math3D.pNxP(Math.cos(nRadient) * oParams.nRadius, aOrthos[0]));
			pPoint = Math3D.pAdd(pPoint, Math3D.pNxP(Math.sin(nRadient) * oParams.nRadius, aOrthos[1]));
			aBasePoints.push(pPoint);
		}
		
		var aColors = [];
		var aPositions = [];
		
		aPositions.push(pTip);
		aColors.push(oParams.aColor);
		
		aBasePoints.forEach(function(pPoint){
			aPositions.push(pPoint);
			aColors.push(oParams.aColorBottom);
		});
		
		var aIndices = [/*1,2,3,*/];
		var iPrev = aPositions.length - 1;
		for (var iP = 1; iP < aPositions.length; iP ++) {
			aIndices.push(0, iP, iPrev);
			iPrev = iP;
		}
		
		oReturn = oG.oCreateAttributeBufferGroup({v4Position: aPositions, v3Color: aColors}, aIndices);
		
		return oReturn;
		
	},
	
	
	
	
};



