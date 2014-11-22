



var oMakeWall = function (aWallArray) {
	
	var aWallDelta = [aWallArray[2] - aWallArray[0], aWallArray[3] - aWallArray[1]];
	
	var mMatrix = oLA.mMatrixFromCenterNormal(aWallArray, aWallDelta, false);
	
	var pWallA = [aWallArray[0], aWallArray[1]];
	var pWallB = [aWallArray[2], aWallArray[3]];
	
	var mTrans = oLA.mInverseTranslation(pWallA);
	var mRot = oLA.mInverseRotation(aWallDelta, false);
	var mBoth = oLA.mMultiplyMM(mRot, mTrans);
	
	oLA.vPrintP(oLA.pMultiplyMP(mRot, oLA.pMultiplyMP(mTrans, pWallB)));
	oLA.vPrintP(oLA.pMultiplyMP(mTrans, oLA.pMultiplyMP(mRot, pWallB)));
	oLA.vPrintP(oLA.pMultiplyMP(mBoth, pWallB));
	
	var nLength = oLA.nLength(aWallDelta);
	
	var oWall = {aArray: aWallArray, mMatrix: mMatrix, nLength: nLength};
	
	return oWall;
	
};



