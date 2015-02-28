



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
			oReturn = oG.oCreateAttributeBufferPackage(oReturn);
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
		
		oParams.pDir = Math3D.pNormalize(oParams.pDir);
		
		var pTip = Math3D.pNxP(oParams.nLength, oParams.pDir);
		
		var nMaxDelta = 0;
		var pMaxDeltaDir = null;
		for (var iD = 0; iD < 3; iD ++) {
			var pTestDir = new Float32Array([0,0,0]);
			pTestDir[iD] = 1;
			var nDelta = Math3D.nLength(Math3D.pSub(oParams.pDir, pTestDir));
			if (nDelta > nMaxDelta) {
				nMaxDelta = nDelta;
				pMaxDeltaDir = pTestDir;
			}
		}
		var pOrthoA = Math3D.pPxP(oParams.pDir, pMaxDeltaDir);
		var pOrthoB = Math3D.pPxP(oParams.pDir, pOrthoA);
		
		var aBasePoints = [];
		for (var iP = 0; iP < 3; iP ++) {
			var nRadient = (2 * Math.PI / 3) * iP;
			var pPoint = new Float32Array([0,0,0]);
			pPoint = Math3D.pAdd(pPoint, Math3D.pNxP(Math.cos(nRadient) * oParams.nRadius, pOrthoA));
			pPoint = Math3D.pAdd(pPoint, Math3D.pNxP(Math.sin(nRadient) * oParams.nRadius, pOrthoB));
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
		
		var aIndices = [/*1,2,3,*/0,1,2,0,2,3,0,3,1];
		
		oReturn = oG.oCreateAttributeBufferPackage({v4Position: aPositions, v3Color: aColors}, aIndices);
console.log(oReturn);
		
		return oReturn;
		
	},
	
	
	
	
};



