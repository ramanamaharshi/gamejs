



var pFindPenetrationPoint = function (aPolygon, pPoint) {
	
	var pReturn = null;
	
	var iMinDepthNr = -1;
	var nMinDepth = 9999999;
	var pMinDepthRelPos = [0,0];
	
	var pA = aPolygon[aPolygon.length - 1];
	
	for (var iP = 0; iP < aPolygon.length; iP ++) {
		
		var pB = aPolygon[iP];
		
		var pDelta = oLA.pSub(pB, pA);
		var mMatrixB = oLA.mMatrixFromCenterNormal(pA, pDelta);
		var pPointRel = oLA.pMultiplyMP(mMatrixB, pPoint);
		if (0 <= pPointRel[0] && pPointRel[0] <= oLA.nLength(pDelta)) {
			var nDepth = Math.abs(pPointRel[1]);
			if (nDepth < nMinDepth) {
				iMinDepthNr = iP;
				nMinDepth = nDepth;
				pMinDepthRelPos = pPointRel;
			}
		}
		
		pA = pB;
		
	}
	
	var pA = aPolygon[(iMinDepthNr + aPolygon.length - 1) % aPolygon.length];
	var pB = aPolygon[iMinDepthNr];
//console.log(iMinDepthNr, nMinDepth, pMinDepthRelPos);
//console.log(iP, pA, pB);
	var pDelta = oLA.pSub(pB, pA);
	
	var mTranslate = oLA.mTranslation(pA);
	var mRotateScale = oLA.mRotation(pDelta);
	var mMatrixA = oLA.mMultiplyMM(mTranslate, mRotateScale);
	
	var pReturn = oLA.pMultiplyMP(mMatrixA, [pMinDepthRelPos[0], 0]);
	
	return pReturn;
	
};




var bInPolygon = function (aPolygon, pPoint) {
	
	var pX = pPoint[0];
	var pY = pPoint[1];
	
	var iIntersections = 0;
	var pPPP = aPolygon[aPolygon.length - 1];
	
	for (var iP = 0; iP < aPolygon.length; iP ++) {
		var pPP = aPolygon[iP];
		var bIntersects = false;
		if (pPP[0] < pPPP[0]) {
			bIntersects = pPP[0] <= pX && pX <= pPPP[0];
		} else if (pPPP[0] < pPP[0]) {
			bIntersects = pPPP[0] <= pX && pX <= pPP[0];
		} else {
			bIntersects = false;
		}
		if (bIntersects) {
			var nIntersectionY = pPP[1] + (pX - pPP[0]) * ((pPPP[1] - pPP[1]) / (pPPP[0] - pPP[0]));
			if (pPP[1] < pPPP[1]) {
				bIntersects = pPP[1] <= nIntersectionY && nIntersectionY <= pPPP[1];
			} else {
				bIntersects = pPPP[1] <= nIntersectionY && nIntersectionY <= pPP[1];
			}
			if (bIntersects) {
				if (nIntersectionY < pY) {
					iIntersections ++;
				}
			}
		}
		pPPP = pPP;
	}
	
	return ((iIntersections % 2) == 1);
	
};




var aTransformPolygon = function (mM, aP) {
	
	var aReturn = aClonePolygon(aP);
	
	for (var iP = 0; iP < aReturn.length; iP ++) {
		aReturn[iP] = oLA.pMultiplyMP(mM, aReturn[iP]);
	}
	
	return aReturn;
	
};




var aClonePolygon = function (aP) {
	
	var aClone = aP.slice(0);
	
	for (var iP = 0; iP < aClone.length; iP ++) {
		aClone[iP] = aP[iP].slice(0);
	}
	
	return aClone;
	
};



