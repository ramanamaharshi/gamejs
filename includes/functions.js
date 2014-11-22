



var oMakeWall = function (aWallArray) {
	
	var aWallDelta = [aWallArray[2] - aWallArray[0], aWallArray[3] - aWallArray[1]];
	
	var mTransA = oLA.mInverseTranslation(aWallArray);
	var mRotA = oLA.mInverseRotation(aWallDelta, false);
	var mMatrixA = oLA.mMultiplyMM(mRotA, mTransA);
	
	var mTransB = oLA.mTranslation(aWallArray);
	var mRotB = oLA.mRotation(aWallDelta, false);
	var mMatrixB = oLA.mMultiplyMM(mTransB, mRotB);
	
	var nLength = oLA.nLength(aWallDelta);
	
	var oWall = {aArray: aWallArray, mMatrixA: mMatrixA, mMatrixB: mMatrixB, nLength: nLength};
	
	return oWall;
	
};



