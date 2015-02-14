

var Math3D = Math3D || {};




Math3D.pPxP = function (pA, pB) {
	
	var pReturn = new Float32Array(3);
	
	pReturn[0] = pA[1] * pB[2] - pA[2] * pB[1];
	pReturn[1] = pA[2] * pB[0] - pA[0] * pB[2];
	pReturn[2] = pA[0] * pB[1] - pA[1] * pB[0];
	
	return pReturn;
	
};




Math3D.pNormalize = function (pP) {
	
	var pReturn = new Float32Array(3);
	
	var nLength = Math.sqrt(pP[0] * pP[0] + pP[1] * pP[1] + pP[2] * pP[2]);
	
	pReturn[0] = pP[0] / nLength;
	pReturn[1] = pP[1] / nLength;
	pReturn[2] = pP[2] / nLength;
	
	return pReturn;
	
};




Math3D.pNxP = function (nN, pP) {
	
	return new Float32Array([nN * pP[0], nN * pP[1], nN * pP[2]]);
	
};




Math3D.pNull = function () {
	
	return new Float32Array([0,0,0]);
	
};


