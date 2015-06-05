

var Math3D = Math3D || {};




/**
 * pP = pPxP(aR[0], aR[1]);
 */
Math3D.aMakeOrthogonals = function (pP) {
	
	var aReturn = [];
	
	var nMaxDiff = 0;
	var pMaxDiffDir = null;
	
	for (var iD = 0; iD < 3; iD ++) {
		var pDiffDir = new Float32Array([0,0,0]);
		pDiffDir[iD] = 1;
		var nDiff = 0;
		for (var iI = 0; iI < 3; iI ++) {
			nDiff = (pDiffDir[iI] - pP[iI]) * (pDiffDir[iI] - pP[iI]);
		}
		if (nDiff < 3.9 && nDiff > nMaxDiff) {
			nMaxDiff = nDiff;
			pMaxDiffDir = pDiffDir;
		}
	}
	
	aReturn.push(Math3D.pNormalize(Math3D.pPxP(pP, pMaxDiffDir)));
	aReturn.push(Math3D.pNormalize(Math3D.pPxP(pP, aReturn[0])));
	
	return aReturn;
	
};




/**
 * cross product
 * x = pPxP(y,z)
 * y = pPxP(z,x)
 * z = pPxP(x,y)
 */
Math3D.pPxP = function (pA, pB) {
	
	var pReturn = new Float32Array(3);
	
	pReturn[0] = pA[1] * pB[2] - pA[2] * pB[1];
	pReturn[1] = pA[2] * pB[0] - pA[0] * pB[2];
	pReturn[2] = pA[0] * pB[1] - pA[1] * pB[0];
	
	return pReturn;
	
};




Math3D.pNormalize = function (pP) {
	
	var pReturn = new Float32Array(3);
	
	var nLength = Math3D.nLength(pP);
	
	pReturn[0] = pP[0] / nLength;
	pReturn[1] = pP[1] / nLength;
	pReturn[2] = pP[2] / nLength;
	
	return pReturn;
	
};




Math3D.nLength = function (pP) {
	
	return Math.sqrt(pP[0] * pP[0] + pP[1] * pP[1] + pP[2] * pP[2]);
	
};




Math3D.pAdd = function (pA, pB) {
	
	return new Float32Array([
		pA[0] + pB[0],
		pA[1] + pB[1],
		pA[2] + pB[2],
	]);
	
};




Math3D.pSub = function (pA, pB) {
	
	return new Float32Array([
		pA[0] - pB[0],
		pA[1] - pB[1],
		pA[2] - pB[2],
	]);
	
};




Math3D.pNxP = function (nN, pP) {
	
	return new Float32Array([nN * pP[0], nN * pP[1], nN * pP[2]]);
	
};




Math3D.pNull = function () {
	
	return new Float32Array([0,0,0]);
	
};


