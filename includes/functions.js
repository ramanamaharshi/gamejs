



var vHandlePhysics = function (oState) {
	
	
};




var vHandleCollisions = function (oState) {
	
	
};




var bInPolygon = function (aPolygon, pPoint) {
	
	
	
};




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




var vDrawPeople = function (oG, aPeople) {
	
	oG.vSetColor('#222');
	
	for (var iP = 0; iP < aPeople.length; iP ++) {
		var oPerson = aPeople[iP];
		var nR = oPerson.nRadius;
		var nDir = oPerson.nDir;
		var nPosX = oPerson.pP[0];
		var nPosY = oPerson.pP[1];
		oG.vDrawCircle(nPosX, nPosY, nR);
		oG.vDrawLine(nPosX, nPosY, nPosX + 1.33 * nR * Math.cos(nDir), nPosY + 1.33 * nR * Math.sin(nDir));
	}
	
};




var vDrawWalls = function (oG, aWalls) {
	
	oG.vSetColor('#222');
	
	for (var iW = 0; iW < aWalls.length; iW ++) {
		var oWall = aWalls[iW];
		var aWall = oWall.aArray;
		oG.vDrawLine(aWall[0], aWall[1], aWall[2], aWall[3]);
	}
	
};



