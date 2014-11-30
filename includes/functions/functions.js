



var oMakeWall = function (aWallArray) {
	
	var aWallDelta = [aWallArray[2] - aWallArray[0], aWallArray[3] - aWallArray[1]];
	
	var mTransA = oLA.mTranslation(aWallArray);
	var mRotA = oLA.mRotation(aWallDelta, false);
	var mMatrixA = oLA.mMultiplyMM(mTransA, mRotA);
	
	var mTransB = oLA.mInverseTranslation(aWallArray);
	var mRotB = oLA.mInverseRotation(aWallDelta, false);
	var mMatrixB = oLA.mMultiplyMM(mRotB, mTransB);
	
	var nLength = oLA.nLength(aWallDelta);
	
	var oWall = {aArray: aWallArray, mMatrixA: mMatrixA, mMatrixB: mMatrixB, nLength: nLength};
	
	return oWall;
	
};




var vDrawWalls = function (oG, aWalls) {
	
	oG.vSetColor('#222');
	
	for (var iW = 0; iW < aWalls.length; iW ++) {
		var oWall = aWalls[iW];
		var aWall = oWall.aArray;
		oG.vDrawLine(aWall[0], aWall[1], aWall[2], aWall[3]);
	}
	
};




var oMakeParticle = function (pPoint) {
	
	return {pP: [pPoint[0],pPoint[1]], pPold: [pPoint[0],pPoint[1]], pA: [0,0], nIM: 1};
	
};



