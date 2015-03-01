



var Shapes = {};




Shapes.oCylinder = function (oParams) {
	
	oParams = Shapes.oParseParams(oParams, {nRadius: 0.5, nHeight: 1, iColumns: 12, pDir: [0,1,0], aColor: 'colored'});
	
	var oAttributes = {
		v4Position: [],
		v3Color: [],
	};
	
	pDir = Math3D.pNormalize(oParams.pDir);
	
	var aOrthogonals = Math3D.aMakeOrthogonals(pDir);
	
	var aColumns = [];
	for (var iC = 0; iC < oParams.iColumns; iC ++) {
		var nRadient = (2 * Math.PI / oParams.iColumns) * iC;
		var pX = Math3D.pNxP(Math.cos(nRadient) * oParams.nRadius, aOrthogonals[0]);
		var pY = Math3D.pNxP(Math.sin(nRadient) * oParams.nRadius, aOrthogonals[1]);
		aColumns.push(Math3D.pAdd(pX, pY));
	}
	
	var aEnds = [Math3D.pNxP(0.5 * nHeight, pDir), Math3D.pNxP(-0.5 * nHeight, pDir)];
	
	for (var iC = 0; iC < oParams.iColumns; iC ++) {
		var aColumnPair = [aColumns[iC], aColumns[(iC + 1) % oParams.iColumns]];
		for (var iE = 0; iE < 2; iE ++) {
			oAttributes.v4Position.push(
				Math3D.pAdd(aEnds[iE], aColumnPair[0]),
				Math3D.pAdd(aEnds[iE], aColumnPair[1]),
				aEnds[iE]
			);
			
		}
	}
	
	return oAttributes;
	
};




Shapes.oSphere = function (oParams) {
	
	oParams = Shapes.oParseParams(oParams, {nRadius: 0.5, iDepth: 2, aColor: 'colored'});
	
	var oSphereAttrData = {
		v4Position: [],
		v3Color: [],
	};
	
	var aRecursive = function (aTriangle, iDepth) {
		
		if (!iDepth) return [aTriangle];
		
		var aPoints = [];
		for (var iV = 0; iV < 3; iV ++) {
			var pV = aTriangle[iV];
			var pNext = aTriangle[(iV + 1) % 3];
			aPoints.push([pV[0], pV[1], pV[2]]);
			var pBetween = [0,0,0];
			for (var iI = 0; iI < 3; iI ++) {
				pBetween[iI] = (pV[iI] + pNext[iI]) / 2;
			}
			pBetween = Math3D.pNormalize(pBetween);
			pBetween = [pBetween[0],pBetween[1],pBetween[2]];
			aPoints.push(pBetween);
		}
		
		var aTriangles = [];
		
		aTriangles.push([aPoints[1], aPoints[3], aPoints[5]]);
		for (var iV = 0; iV < 3; iV ++) {
			aTriangles.push([aPoints[(2 * iV)], aPoints[(2 * iV + 1) % 6], aPoints[(2 * iV + 5) % 6]]);
		}
		
		var aSubTriangles = [];
		aTriangles.forEach(function(aTriangle){
			aSubTs = aRecursive(aTriangle, iDepth - 1);
			aSubTs.forEach(function(aSubT){
				aSubTriangles.push(aSubT);
			});
		});
		aTriangles = aSubTriangles;
		
		return aTriangles;
		
	};
	
	for (var iBits = 0; iBits < 8; iBits ++) {
		var aTriangle = [];
		for (var iV = 0; iV < 3; iV ++) {
			var aPush = [0,0,0];
			aPush[iV] = 1;
			if (Math.pow(2, iV) & iBits) aPush[iV] *= -1;
			aTriangle.push(aPush);
		}
		if (aTriangle[0][0] * aTriangle[1][1] * aTriangle[2][2] < 0) {
			aTriangle = [aTriangle[2], aTriangle[1], aTriangle[0]];
		}
		var aTriangles = aRecursive(aTriangle, oParams.iDepth);
		var iTNr = -1;
		aTriangles.forEach(function(aPoints){
			iTNr ++;
			aPoints.forEach(function(aPoint){
				var aScaledPoint = [
					oParams.nRadius * aPoint[0],
					oParams.nRadius * aPoint[1],
					oParams.nRadius * aPoint[2],
				];
				oSphereAttrData.v4Position.push(aScaledPoint);
				var aColor = oParams.aColor;
				if (aColor == 'colored') {
					var aColor = [0,0,0];
					if (iTNr % 4 == 0) {
						aColor = [1,1,1];
					} else {
						aColor[(iTNr % 4) - 1] = 1;
					}
				}
				oSphereAttrData.v3Color.push(aColor);
			});
		});
	}
	
	return oSphereAttrData;
	
};




Shapes.oParseParams = function (oParams, oFallback) {
	
	if (typeof oParams == 'undefined') oParams = {};
	
	for (sKey in oFallback) {
		if (typeof oParams[sKey] == 'undefined') {
			oParams[sKey] = oFallback[sKey];
		} else if (typeof oFallback[sKey] == 'object' && oFallback[sKey] instanceof Object) {
			oParams[sKey] = Shape.oParseParams(oParams[sKey], oFallback[sKey]);
		}
	}
	
	return oParams;
	
};



